import dotenv from 'dotenv';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Load environment variables from .env file
dotenv.config({ quiet: true, path: path.join(__dirname, `../.env${NODE_ENV === 'development' ? '.development' : ''}`) });

export class Config {
  public NODE_ENV: string | undefined;
  public PORT: number | undefined;
  public LOG_LEVEL: string | undefined;

  public JWT_SECRET: string | undefined;
  public JWT_EXPIRATION: string | undefined;

  public MONGO_URI: string | undefined;

  public USER_SERVICE_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.PORT = Number(process.env.PORT);

    this.LOG_LEVEL = process.env.LOG_LEVEL;

    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_EXPIRATION = process.env.JWT_EXPIRATION;

    this.MONGO_URI = process.env.MONGO_URI;

    this.USER_SERVICE_URL = process.env.USER_SERVICE_URL;
  }
}

export const config = new Config();
