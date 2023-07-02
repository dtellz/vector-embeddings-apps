import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const sliceIntoChunks = <T>(arr: T[], chunkSize: number) => {
    return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
        arr.slice(i * chunkSize, (i + 1) * chunkSize)
    );
};

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing env variable ${key}`);
    }
    return value;
}

const validateEnvVars = () => {
    getEnv("PINECONE_API_KEY");
    getEnv("PINECONE_ENVIRONMENT");
    getEnv("PINECONE_INDEX");
};

const getIndexingCliArgs = () => {
    const argv = yargs(hideBin(process.argv))
        .option("csvPath", {
            alias: "p",
            type: "string",
            description: "Path to your CSV path",
            demandOption: true,
        })
        .option("column", {
            alias: "c",
            type: "string",
            description: "The name for the CSV column",
            demandOption: true,
        })
        .parseSync();

    const { csvPath, column } = argv;

    if (!csvPath) {
        console.error("Please provide a CSV path");
        process.exit(1);
    }

    return { csvPath, column };
};


export { sliceIntoChunks, getEnv, validateEnvVars, getIndexingCliArgs };
