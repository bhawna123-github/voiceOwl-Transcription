import mongoose, { Document, Schema } from 'mongoose';

// Mongoose document interface for a transcription entry
export interface ITranscription extends Document {
  audioUrl: string;
  transcription: string;
  source?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Schema definition for transcriptions collection
const TranscriptionSchema = new Schema<ITranscription>({
  audioUrl: { type: String, required: true },
  transcription: { type: String, required: true },
  source: { type: String, default: 'mock' },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

// Export model for use in controllers/services
export const Transcription = mongoose.model<ITranscription>('Transcription', TranscriptionSchema);
