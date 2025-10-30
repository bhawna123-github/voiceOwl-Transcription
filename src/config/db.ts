import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Connects to MongoDB using provided URI or starts an in-memory instance if none is given
export async function connectMongo(mongoUri?: string) {
  if (mongoUri) {
    // Connect using existing MongoDB URI
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB (provided URI)');
    return { inMemory: false };
  } else {
    // Use MongoMemoryServer for in-memory MongoDB (useful for testing)
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB (MongoMemoryServer)');
    return { inMemory: true, mongod };
  }
}
