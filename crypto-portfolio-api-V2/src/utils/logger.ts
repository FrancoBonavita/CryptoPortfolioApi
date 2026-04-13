import pino from 'pino';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';

// Ensure logs directory exists
await mkdir('logs', { recursive: true });

// File transport — writes to logs/app.log
const fileStream = createWriteStream('logs/app.log', { flags: 'a' });

// Two transports: console + file
export const logger = pino(
  {
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream([
    { stream: process.stdout },
    { stream: fileStream },
  ]),
);