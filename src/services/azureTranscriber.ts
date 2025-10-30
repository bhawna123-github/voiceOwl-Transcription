export async function mockAzureTranscribe(audioUrl: string, language: string = "en-US") {

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

 return {
  transcript: `Azure mock transcription (${language}) for: ${audioUrl}`,
  metadata: {
    mocked: true,
    source: "azure",
    retriesUsed: 0,
    durationEstimateSec: 3,
    language,
  },
};
}
