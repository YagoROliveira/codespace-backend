import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto, UpdatePasswordDto, UpdateNotificationsDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async findAll(): Promise<any[]> {
    return this.userModel.find().lean().exec();
  }

  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }

  async create(data: { name: string; email: string; password: string; phone?: string }): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = new this.userModel({
      ...data,
      email: data.email.toLowerCase(),
      password: hashedPassword,
    });
    return user.save();
  }

  async createFromGoogle(data: { name: string; email: string; avatar: string }): Promise<UserDocument> {
    const randomPassword = await bcrypt.hash(Math.random().toString(36), 12);
    const user = new this.userModel({
      name: data.name,
      email: data.email.toLowerCase(),
      password: randomPassword,
      avatar: data.avatar,
    });
    return user.save();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.userModel.findById(id).select('+password').exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new NotFoundException('Senha atual incorreta');

    user.password = await bcrypt.hash(dto.newPassword, 12);
    await user.save();
  }

  async updateNotifications(id: string, dto: UpdateNotificationsDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { notificationPreferences: dto } },
        { new: true },
      )
      .exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() }).exec();
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Usuário não encontrado');
  }

  async activateAccount(userId: string, plan: string, subscriptionEndDate: Date): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          accountStatus: 'active',
          plan,
          subscriptionEndDate,
        },
      },
      { new: true },
    ).exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async deactivateAccount(userId: string, status: 'inactive' | 'payment_pending' | 'expired' = 'inactive'): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          accountStatus: status,
          plan: 'free',
        },
      },
      { new: true },
    ).exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async getStripeCustomerId(userId: string): Promise<string> {
    const user = await this.findById(userId);
    return user.stripeCustomerId || '';
  }

  async setStripeCustomerId(userId: string, customerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { stripeCustomerId: customerId }).exec();
  }
}
