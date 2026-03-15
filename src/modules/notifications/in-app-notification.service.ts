import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  InAppNotification,
  InAppNotificationDocument,
} from './schemas/in-app-notification.schema';

@Injectable()
export class InAppNotificationService {
  private readonly logger = new Logger(InAppNotificationService.name);

  constructor(
    @InjectModel(InAppNotification.name)
    private notifModel: Model<InAppNotificationDocument>,
  ) { }

  /** Create a notification for a user */
  async create(data: {
    userId: string;
    title: string;
    message?: string;
    type?: string;
    link?: string;
    metadata?: Record<string, any>;
  }): Promise<InAppNotificationDocument> {
    const notif = await this.notifModel.create({
      userId: new Types.ObjectId(data.userId),
      title: data.title,
      message: data.message || '',
      type: data.type || 'system',
      link: data.link || '',
      metadata: data.metadata || {},
    });
    this.logger.debug(`Notification created for user ${data.userId}: ${data.title}`);
    return notif;
  }

  /** Get all notifications for a user (newest first, limit 50) */
  async findByUser(
    userId: string,
    opts?: { unreadOnly?: boolean; limit?: number },
  ): Promise<any[]> {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (opts?.unreadOnly) query.read = false;

    return this.notifModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(opts?.limit || 50)
      .lean()
      .exec();
  }

  /** Count unread notifications */
  async countUnread(userId: string): Promise<number> {
    return this.notifModel.countDocuments({
      userId: new Types.ObjectId(userId),
      read: false,
    });
  }

  /** Mark a single notification as read */
  async markAsRead(notifId: string, userId: string): Promise<void> {
    const result = await this.notifModel.findOneAndUpdate(
      { _id: notifId, userId: new Types.ObjectId(userId) },
      { read: true },
    );
    if (!result) throw new NotFoundException('Notificação não encontrada');
  }

  /** Mark all notifications as read for a user */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.notifModel.updateMany(
      { userId: new Types.ObjectId(userId), read: false },
      { read: true },
    );
    return result.modifiedCount;
  }

  /** Delete a notification */
  async delete(notifId: string, userId: string): Promise<void> {
    await this.notifModel.findOneAndDelete({
      _id: notifId,
      userId: new Types.ObjectId(userId),
    });
  }
}
