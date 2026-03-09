import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Channel, ChannelDocument } from './schemas/channel.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto, CreateChannelDto } from './dto/community.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) { }

  // Channels
  async getChannels(): Promise<ChannelDocument[]> {
    return this.channelModel.find({ isActive: true }).sort({ order: 1 }).exec();
  }

  async createChannel(dto: CreateChannelDto): Promise<ChannelDocument> {
    const channel = new this.channelModel(dto);
    return channel.save();
  }

  // Messages
  async getMessages(channelId: string, page = 1, limit = 50): Promise<any> {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.messageModel
        .find({
          channelId: new Types.ObjectId(channelId),
          parentMessageId: null,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name avatar role plan')
        .exec(),
      this.messageModel.countDocuments({
        channelId: new Types.ObjectId(channelId),
        parentMessageId: null,
      }),
    ]);

    return {
      messages: messages.reverse(),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPinnedMessages(channelId: string): Promise<MessageDocument[]> {
    return this.messageModel
      .find({
        channelId: new Types.ObjectId(channelId),
        isPinned: true,
      })
      .populate('userId', 'name avatar role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async createMessage(userId: string, dto: CreateMessageDto): Promise<MessageDocument> {
    const message = new this.messageModel({
      ...dto,
      userId: new Types.ObjectId(userId),
      channelId: new Types.ObjectId(dto.channelId),
      parentMessageId: dto.parentMessageId
        ? new Types.ObjectId(dto.parentMessageId)
        : null,
    });

    const saved = await message.save();

    // If it's a reply, increment parent's reply count
    if (dto.parentMessageId) {
      await this.messageModel.findByIdAndUpdate(dto.parentMessageId, {
        $inc: { replyCount: 1 },
      });
    }

    return saved.populate('userId', 'name avatar role plan');
  }

  async toggleLike(messageId: string, userId: string): Promise<MessageDocument> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) throw new NotFoundException('Mensagem não encontrada');

    const userObjectId = new Types.ObjectId(userId);
    const likeIndex = message.likes.findIndex(
      (id) => id.toString() === userId,
    );

    if (likeIndex > -1) {
      message.likes.splice(likeIndex, 1);
    } else {
      message.likes.push(userObjectId);
    }

    await message.save();
    return message.populate('userId', 'name avatar role plan');
  }

  async togglePin(messageId: string): Promise<MessageDocument> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) throw new NotFoundException('Mensagem não encontrada');

    message.isPinned = !message.isPinned;
    await message.save();
    return message;
  }

  async getReplies(messageId: string): Promise<MessageDocument[]> {
    return this.messageModel
      .find({ parentMessageId: new Types.ObjectId(messageId) })
      .populate('userId', 'name avatar role plan')
      .sort({ createdAt: 1 })
      .exec();
  }
}
