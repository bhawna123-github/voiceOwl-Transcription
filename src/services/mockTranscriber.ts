export async function mockTranscribe(audioUrl: string) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`Attempt ${attempt}: downloading ${audioUrl}`);

      // Simulate download step (mock)
      await simulateDownload(audioUrl);

      // Build a fake transcription result
      const fileName = audioUrl.split('/').pop() || 'audio-file';
      const transcript = `Mock transcription for "${fileName}".`;
      const metadata = {
        mocked: true,
        source: audioUrl,
        retriesUsed: attempt - 1,
        durationEstimateSec: Math.floor(Math.random() * 200) + 5
      };
      return { transcript, metadata };
    } catch (error) {
      console.warn(`Download attempt ${attempt} failed:`, (error as Error).message);
      if (attempt >= maxRetries) {
        throw new Error(`Failed to download after ${maxRetries} attempts`);
      }
      // Retry after short delay
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Shouldn't hit this point
  throw new Error('Unknown error during transcription');
}

// Simulates a network download with a small chance of failure
async function simulateDownload(url: string) {
  await new Promise((r) => setTimeout(r, 300)); // fake network delay
  const random = Math.random();

  if (random < 0.3) {
    throw new Error('Network error while downloading');
  }

  return true;
}
