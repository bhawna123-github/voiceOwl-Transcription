import { Request, Response } from 'express';
import { Transcription } from '../models/Transcription';
import { isValidHttpUrl } from '../utils/validateUrl';
import { mockTranscribe } from '../services/mockTranscriber';
import { TranscriptionListResponse, TranscriptionRequest, TranscriptionResponse } from '../types/transcript';

// Handle POST /transcription
export async function createTranscription(
  req: Request<{}, {}, TranscriptionRequest>,
  res: Response<TranscriptionResponse | { error: string }>
) {
  try {
    const { audioUrl } = req.body || {};

    // Basic validation for the audio URL
    if (!audioUrl || !isValidHttpUrl(audioUrl)) {
      return res
        .status(400)
        .json({ error: 'audioUrl is required and must be a valid http/https URL' });
    }

    // Mock transcription service call
    const { transcript, metadata } = await mockTranscribe(audioUrl);

    // Save transcription result to DB
    const doc = new Transcription({ audioUrl, transcription: transcript, source: 'mock', metadata });
    await doc.save();

    // Prepare response payload
    const response: TranscriptionResponse = {
      id: doc.id.toString(),
      audioUrl: doc.audioUrl,
      transcription: doc.transcription,
      createdAt: doc.createdAt
    };

    return res.status(201).json(response);
  } catch (err) {
    console.error('createTranscription error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Handle GET /transcriptions
export async function getRecentTranscriptions(
  req: Request,
  res: Response<TranscriptionListResponse | { error: string }>
) {
  try {
    // Filter transcriptions created in the last 30 days
    const now = new Date();
    const days30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const docs = await Transcription.find({ createdAt: { $gte: days30 } })
      .sort({ createdAt: -1 })
      .lean();

    const response: TranscriptionListResponse = {
      count: docs.length,
      data: docs.map((d) => ({
        id: d._id.toString(),
        audioUrl: d.audioUrl,
        transcription: d.transcription,
        createdAt: d.createdAt
      }))
    };

    return res.json(response);
  } catch (err) {
    console.error('getRecentTranscriptions error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
