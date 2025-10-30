import { Router } from "express";
import { createAzureTranscription } from "../controllers/azureController";

const router = Router();
router.post("/azure-transcription", createAzureTranscription);
export default router;
