import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  userId: mongoose.Types.ObjectId;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
    tags: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INote>('Note', NoteSchema);
