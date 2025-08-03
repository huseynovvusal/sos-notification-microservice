import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export class Config {
  public NODE_ENV: string | undefined;
  public PORT: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.PORT = process.env.PORT;
  }
}

export const config = new Config();
