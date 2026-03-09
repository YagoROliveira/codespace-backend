import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Resource extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['ebook', 'cheatsheet', 'video', 'article', 'template', 'tool'] })
  type: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  fileUrl: string;

  @Prop()
  externalUrl: string;

  @Prop()
  thumbnailUrl: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  requiredPlans: string[];

  @Prop({ default: 0 })
  downloads: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop()
  author: string;

  @Prop()
  difficulty: string;

  @Prop()
  estimatedReadTime: number;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
ResourceSchema.index({ type: 1, category: 1 });
ResourceSchema.index({ tags: 1 });

@Schema({ timestamps: true })
export class ResourceBookmark extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Resource', required: true })
  resourceId: Types.ObjectId;
}

export const ResourceBookmarkSchema = SchemaFactory.createForClass(ResourceBookmark);
ResourceBookmarkSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

@Schema({ timestamps: true })
export class ResourceLike extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Resource', required: true })
  resourceId: Types.ObjectId;
}

export const ResourceLikeSchema = SchemaFactory.createForClass(ResourceLike);
ResourceLikeSchema.index({ userId: 1, resourceId: 1 }, { unique: true });
