import dotenv from 'dotenv';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Load environment variables from .env file
dotenv.config({ quiet: true, path: path.join(__dirname, `../.env${NODE_ENV === 'development' ? '.development' : ''}`) });

export class Config {
  public NODE_ENV: string | undefined;
  public PORT: number | undefined;

  public MONGO_URI: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.PORT = Number(process.env.PORT);
    this.MONGO_URI = process.env.MONGO_URI;
  }
}

export const config = new Config();
