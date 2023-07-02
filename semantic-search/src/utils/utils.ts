

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


export { sliceIntoChunks, getEnv, validateEnvVars };
