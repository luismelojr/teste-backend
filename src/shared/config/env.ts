function getEnvFilePath(): string[] {
  const env = process.env.NODE_ENV;

  if (env === 'test' || env === 'ci') {
    return ['.env.test.local', '.env.test'];
  }

  return [`.env.${env || 'development'}`];
}

export { getEnvFilePath };
