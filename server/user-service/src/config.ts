import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export class Config {
  public NODE_ENV: string | undefined;
  public PORT: number | undefined;

  public DATABASE_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.PORT = Number(process.env.PORT);
    this.DATABASE_URL = process.env.DATABASE_URL;
  }
}

export const config = new Config();
