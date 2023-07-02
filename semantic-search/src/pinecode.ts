import { PineconeClient } from '@pinecone-database/pinecone';
import { config } from 'dotenv';
import { getEnv, validateEnvVars } from './utils/utils.js';

config();

let pineconeClient: PineconeClient | null = null;

// Resolves to a PineconeClient instance
export const getPineconeClient = async (): Promise<PineconeClient> => {
    validateEnvVars();
    if (!pineconeClient) {
        pineconeClient = new PineconeClient();

        await pineconeClient.init({
            apiKey: getEnv('PINECONE_API_KEY'),
            environment: getEnv('PINECONE_ENVIRONMENT'),
        });
    }
    return pineconeClient!;
}
