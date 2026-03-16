import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../modules/users/schemas/user.schema';

interface CachedUser {
  data: any;
  cachedAt: number;
}

/**
 * Lightweight in-memory user cache for JWT validation.
 * 
 * In serverless (Vercel), every authenticated request triggers JwtStrategy.validate()
 * which does a MongoDB findById. This adds 100-300ms per request just for auth.
 * 
 * This cache stores user data in-memory for a short TTL, eliminating 
 * redundant MongoDB queries within the same lambda invocation window.
 * 
 * TTL: 60s — short enough for security (status changes), long enough
 * to avoid repeated DB hits during a user's active session.
 */
@Injectable()
export class UserCacheService {
  private readonly logger = new Logger(UserCacheService.name);
  private cache = new Map<string, CachedUser>();
  private readonly TTL_MS = 60_000; // 60 seconds
  private readonly MAX_SIZE = 500;  // max cached users
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    // Periodic cleanup every 2 minutes
    this.cleanupTimer = setInterval(() => this.cleanup(), 120_000);
  }

  /**
   * Get user for JWT validation — cache-first, then MongoDB.
   * Only fetches fields needed for auth + common UI needs.
   */
  async getForAuth(userId: string): Promise<any | null> {
    const cached = this.cache.get(userId);
    if (cached && (Date.now() - cached.cachedAt) < this.TTL_MS) {
      return cached.data;
    }

    const user = await this.userModel.findById(userId)
      .select('name email avatar phone bio github linkedin plan status accountStatus role mentorId streakDays totalHours notificationPreferences lastLoginAt')
      .lean()
      .exec();

    if (user) {
      // Evict oldest if at capacity
      if (this.cache.size >= this.MAX_SIZE) {
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey) this.cache.delete(oldestKey);
      }
      this.cache.set(userId, { data: user, cachedAt: Date.now() });
    }

    return user;
  }

  /**
   * Invalidate a user's cache entry (call after updates).
   */
  invalidate(userId: string): void {
    this.cache.delete(userId);
  }

  /**
   * Clear all cache entries.
   */
  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    let evicted = 0;
    for (const [key, entry] of this.cache) {
      if (now - entry.cachedAt > this.TTL_MS) {
        this.cache.delete(key);
        evicted++;
      }
    }
    if (evicted > 0) {
      this.logger.debug(`Cache cleanup: evicted ${evicted} entries, ${this.cache.size} remaining`);
    }
  }
}
