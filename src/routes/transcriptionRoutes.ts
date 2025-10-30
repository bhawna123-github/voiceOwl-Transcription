import { Router } from 'express';
import { createTranscription, getRecentTranscriptions } from '../controllers/transcriptionController';

const router = Router();

router.post('/transcription', createTranscription);
router.get('/transcriptions', getRecentTranscriptions);

export default router;
