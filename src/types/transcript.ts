// Interface for incoming POST /transcription body
export interface TranscriptionRequest {
  audioUrl: string;
}

// Interface for response after creating transcription
export interface TranscriptionResponse {
  id: string;
  audioUrl: string;
  transcription: string;
  createdAt: Date;
}

// Interface for GET /transcriptions response
export interface TranscriptionListResponse {
  count: number;
  data: TranscriptionResponse[];
}
