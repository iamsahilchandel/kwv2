export class HealthEntity {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  timestamp: string;

  constructor(status: HealthEntity['status']) {
    this.status = status;
    this.uptime = process.uptime();
    this.timestamp = new Date().toISOString();
  }
}
