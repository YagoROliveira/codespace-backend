import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(dto: RegisterDto) {
    // Check if user exists
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = await this.usersService.create(dto);
    const token = this.generateToken(String(user._id), user.email);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        avatar: user.avatar,
        accountStatus: user.accountStatus || 'inactive',
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Update last login
    await this.usersService.updateLastLogin(String(user._id));

    const token = this.generateToken(String(user._id), user.email);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        avatar: user.avatar,
        accountStatus: user.accountStatus || 'inactive',
      },
      token,
    };
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Usuário inválido ou inativo');
    }
    return user;
  }

  async googleLogin(accessToken: string) {
    // Verify the Google access token by fetching user info
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      throw new UnauthorizedException('Token Google inválido');
    }
    const payload = await res.json();
    if (!payload.email) {
      throw new UnauthorizedException('Token Google inválido');
    }

    let user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      user = await this.usersService.createFromGoogle({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        avatar: payload.picture || '',
      });
    }

    const token = this.generateToken(String(user._id), user.email);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        avatar: user.avatar,
        accountStatus: user.accountStatus || 'inactive',
      },
      token,
    };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
