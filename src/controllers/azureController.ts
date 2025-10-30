import { Request, Response } from "express";
import { Transcription } from "../models/Transcription";
import { mockAzureTranscribe } from "../services/azureTranscriber";
import { isValidHttpUrl } from "../utils/validateUrl";

export async function createAzureTranscription(req: Request, res: Response) {
  try {
    const { audioUrl, language = "en-US" } = req.body;

    if (!audioUrl || !isValidHttpUrl(audioUrl)) {
      return res
        .status(400)
        .json({ error: "audioUrl is required and must be a valid http/https URL" });
    }

    // Call mock Azure transcriber
    const { transcript, metadata } = await mockAzureTranscribe(audioUrl, language);


    // Save to MongoDB
    const doc = new Transcription({
      audioUrl,
      transcription: transcript,
      source: "azure",
      metadata,
    });
    await doc.save();

    return res.status(201).json({
      id: doc.id.toString(),
      audioUrl: doc.audioUrl,
      transcription: doc.transcription,
      source: doc.source,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    console.error("createAzureTranscription error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
