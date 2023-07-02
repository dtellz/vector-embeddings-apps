import { utils } from "@pinecone-database/pinecone";
import cliProgress from "cli-progress";
import { config } from "dotenv";
import { loadCsvFile } from "./csvLoader.js";
import { embedder } from "./embeddings.js";
import { getPineconeClient } from "./pinecone.js";
import { getEnv, getIndexingCliArgs } from "./utils/utils.js";
import heapdump from "heapdump";

const { createIndexIfNotExists, chunkedUpsert } = utils;
config();

const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

const indexName = getEnv("PINECONE_INDEX");
let counter = 0;

const run = async () => {
  // Get the CSV path and column name from the CLI args
  const { csvPath, column } = getIndexingCliArgs();

  // Get the Pinecone client instance
  const pineconeClient = await getPineconeClient();

  // Create a readable stream from the CSV file
  const { data, meta } = await loadCsvFile(csvPath);

  // Ensure the selected colum exists in the CSV
  if (!meta.fields?.includes(column)) {
    console.error(`Column ${column} not found in CSV`);
    process.exit(1);
  }

  // Extract the selected column from the CSV
  const documents = data.map((row) => row[column] as string);

  // Create the pinecone index if it doesn't exist with the expected dimension of the 'Xenova/all-MiniLM-L6-v2' model embeddings
  await createIndexIfNotExists(pineconeClient, indexName, 384);

  // select the target index
  const index = pineconeClient.Index(indexName);

  // Start the progress bar
  progressBar.start(documents.length, 0);

  // Start the batch embedding process
  await embedder.init();
  await embedder.embedBatch(documents, 1, async (embeddings) => {
    // Upsert the embeddings into the index
    await chunkedUpsert(index, embeddings, "default");
    console.log(process.memoryUsage());
    counter += embeddings.length;
    progressBar.update(counter);
  });

  progressBar.stop();
  console.log(`Indexed ${counter} documents into ${indexName}`);
};

run();
