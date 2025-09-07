import dotenv from 'dotenv';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Load environment variables from .env file
dotenv.config({ quiet: true, path: path.join(__dirname, `../.env${NODE_ENV === 'development' ? '.development' : ''}`) });

export class Config {
  public NODE_ENV: string;
  public PORT: number;
  public GRPC_HOST: string;
  public GRPC_PORT: number;
  public MONGO_URI: string;
  public EUREKA_HOST: string;
  public EUREKA_PORT: number;
  public EUREKA_SERVICE_NAME: string = process.env.EUREKA_SERVICE_NAME || 'user-service';

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.PORT = this.getNumberEnv('PORT');
    this.GRPC_HOST = this.getStringEnv('GRPC_HOST');
    this.GRPC_PORT = this.getNumberEnv('GRPC_PORT');
    this.MONGO_URI = this.getStringEnv('MONGO_URI');
    this.EUREKA_HOST = this.getStringEnv('EUREKA_HOST');
    this.EUREKA_PORT = this.getNumberEnv('EUREKA_PORT');
  }

  private getStringEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
  }

  private getNumberEnv(key: string): number {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
      throw new Error(`Environment variable ${key} must be a number`);
    }
    return numberValue;
  }
}

export const config = new Config();
