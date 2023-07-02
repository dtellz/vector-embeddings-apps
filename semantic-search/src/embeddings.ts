import { Vector } from "@pinecone-database/pinecone";
import { Pipeline } from "@xenova/transformers";
import { v4 as uuidv4 } from "uuid";
import { sliceIntoChunks } from "./utils/utils.js";

class Embedder {
  private pipe: Pipeline | null = null;

  // Init the pipeline
  async init() {
    const { pipeline } = await import("@xenova/transformers");
    this.pipe = await pipeline("embeddings", "Xenova/all-MiniLM-L6-v2");
  }

  // Embed a single sentence
  async embed(sentence: string): Promise<Vector> {
    if (!this.pipe) {
      throw new Error("Embedder not initialized");
    }
    const result = await this.pipe(sentence);
    return {
      id: uuidv4(),
      metadata: {
        sentence,
      },
      values: Array.from(result.data),
    };
  }

  // Embed a list of sentences
  async embedBatch(
    sentences: string[],
    batchSize: number,
    onDoneBatch: (batch: Vector[]) => void
  ): Promise<void> {
    if (!this.pipe) {
      throw new Error("Embedder not initialized");
    }
    const chunks = sliceIntoChunks<string>(sentences, batchSize);
    for (const chunk of chunks) {
      const batches = await Promise.all(
        chunk.map((sentence) => this.embed(sentence))
      );
      onDoneBatch(batches);
    }
  }
}

const embedder = new Embedder();

export { embedder };
