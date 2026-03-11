import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ─── Individual file in the workspace ───
@Schema({ _id: false })
export class WorkspaceFile {
  @Prop({ required: true })
  path: string; // e.g. "src/index.ts" or "src/" (for folders, ends with /)

  @Prop({ default: '' })
  content: string;

  @Prop({ default: 'plaintext' })
  language: string;

  @Prop({ default: false })
  isFolder: boolean;
}

export const WorkspaceFileSchema = SchemaFactory.createForClass(WorkspaceFile);

// ─── Workspace (one per user) ───
export type WorkspaceDocument = Workspace & Document;

@Schema({ timestamps: true })
export class Workspace {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ default: 'Meu Projeto' })
  name: string;

  @Prop({ type: [WorkspaceFileSchema], default: [] })
  files: WorkspaceFile[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
