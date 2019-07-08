export interface ISqlConfig {
  client: string;
  host: string;
  user: string;
  password: string;
  database: string;
  timezone: string;
  connectionLimit: number;
}
