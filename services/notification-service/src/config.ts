import dotenv from 'dotenv';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Load environment variables from .env file
dotenv.config({ quiet: true, path: path.join(__dirname, `../.env${NODE_ENV === 'development' ? '.development' : ''}`) });

export class Config {
  public NODE_ENV: string | undefined;
  public PORT: number | undefined;
  public LOG_LEVEL: string | undefined;

  public GRPC_HOST: string | undefined;
  public GRPC_PORT: number | undefined;
  public USER_SERVICE_GRPC_ADDRESS: string | undefined;

  public RABBITMQ_URL: string | undefined;

  public EMAIL_SERVICE_HOST: string | undefined;
  public EMAIL_SERVICE_PORT: number | undefined;
  public EMAIL_SERVICE_USER: string | undefined;
  public EMAIL_SERVICE_PASSWORD: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.PORT = Number(process.env.PORT);

    this.LOG_LEVEL = process.env.LOG_LEVEL;

    this.GRPC_HOST = process.env.GRPC_HOST;
    this.GRPC_PORT = Number(process.env.GRPC_PORT);
    this.USER_SERVICE_GRPC_ADDRESS = process.env.USER_SERVICE_GRPC_ADDRESS;

    this.RABBITMQ_URL = process.env.RABBITMQ_URL;

    this.EMAIL_SERVICE_HOST = process.env.EMAIL_SERVICE_HOST;
    this.EMAIL_SERVICE_PORT = Number(process.env.EMAIL_SERVICE_PORT);
    this.EMAIL_SERVICE_USER = process.env.EMAIL_SERVICE_USER;
    this.EMAIL_SERVICE_PASSWORD = process.env.EMAIL_SERVICE_PASSWORD;
  }
}

export const config = new Config();
