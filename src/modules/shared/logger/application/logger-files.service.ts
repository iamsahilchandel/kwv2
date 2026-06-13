import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import path from 'path';
import dayjs from 'dayjs';

@Injectable()
export class LoggerFilesService {
  private readonly logger = new Logger(LoggerFilesService.name);
  private readonly logsDir = path.resolve(process.cwd(), 'logs');

  async getLogs(date?: string): Promise<{ date: string; logs: string[] }> {
    const formattedDate = date ?? dayjs().format('YYYY-MM-DD');
    const filePath = path.join(this.logsDir, `all-${formattedDate}.log`);
    return { date: formattedDate, logs: await this.readLogFile(filePath) };
  }

  async getErrors(date?: string): Promise<{ date: string; errors: string[] }> {
    const formattedDate = date ?? dayjs().format('YYYY-MM-DD');
    const filePath = path.join(this.logsDir, `error-${formattedDate}.log`);
    return { date: formattedDate, errors: await this.readLogFile(filePath) };
  }

  private async readLogFile(filePath: string): Promise<string[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content.split('\n').filter((line) => line.trim() !== '');
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        this.logger.warn('Log file not found', { filePath });
        return [];
      }
      this.logger.error('Failed to read log file', (err as Error).stack);
      throw err;
    }
  }
}
