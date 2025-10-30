import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { Transcription } from '../models/Transcription';
import * as mockService from '../services/mockTranscriber';
import * as validateUtil from '../utils/validateUrl';
import { connectMongo } from '../config/db';

// Spin up in-memory MongoDB before running tests
beforeAll(async () => {
  await connectMongo();
});

// Clean up between each test
afterEach(async () => {
  await Transcription.deleteMany({});
});

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Transcription Controller Tests', () => {
  describe('POST /transcription', () => {
    it('should return 400 if audioUrl is missing', async () => {
      const res = await request(app).post('/transcription').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if audioUrl is invalid', async () => {
      jest.spyOn(validateUtil, 'isValidHttpUrl').mockReturnValue(false);
      const res = await request(app)
        .post('/transcription')
        .send({ audioUrl: 'invalid-url' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/valid http\/https URL/i);
      jest.restoreAllMocks();
    });

    it('should create a transcription successfully', async () => {
      jest.spyOn(validateUtil, 'isValidHttpUrl').mockReturnValue(true);
      jest.spyOn(mockService, 'mockTranscribe').mockResolvedValue({
        transcript: 'Mock transcription for test.mp3',
        metadata: {
          mocked: true,
          source: 'https://example.com/test.mp3',
          retriesUsed: 0,
          durationEstimateSec: 120,
        },
      });

      const res = await request(app)
        .post('/transcription')
        .send({ audioUrl: 'https://example.com/test.mp3' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.audioUrl).toBe('https://example.com/test.mp3');
      expect(res.body.transcription).toContain('Mock transcription');
      expect(res.body).toHaveProperty('createdAt');

      jest.restoreAllMocks();
    });

    it('should handle internal errors gracefully', async () => {
      jest.spyOn(validateUtil, 'isValidHttpUrl').mockReturnValue(true);
      jest.spyOn(mockService, 'mockTranscribe').mockRejectedValue(new Error('fail'));

      const res = await request(app)
        .post('/transcription')
        .send({ audioUrl: 'https://example.com/test.mp3' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
      jest.restoreAllMocks();
    });
  });

  describe('GET /transcriptions', () => {
    it('should return empty list if no transcriptions exist', async () => {
      const res = await request(app).get('/transcriptions');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(0);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return only last 30 days transcriptions', async () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000);

      await Transcription.create([
        { audioUrl: 'https://example.com/recent.mp3', transcription: 'Recent', createdAt: now },
        { audioUrl: 'https://example.com/old.mp3', transcription: 'Old', createdAt: oldDate },
      ]);

      const res = await request(app).get('/transcriptions');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].audioUrl).toBe('https://example.com/recent.mp3');
    });
  });
});
