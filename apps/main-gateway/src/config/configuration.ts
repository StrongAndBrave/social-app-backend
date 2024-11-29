import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
}

export class ApiSettings {
  @IsNumber()
  PORT!: number;

  @IsString()
  LOCAL_HOST!: string;
}


export class DatabaseSettings {
  @IsString()
  DATABASE_URL!: string;
}


export class FilesServiceSettings {
  @IsString()
  FILES_SERVICE_HOST!: string;

  @IsNumber()
  FILES_SERVICE_PORT!: number;
}

export class RabbitMQSettings {
  @IsString()
  RABBITMQ_URL!: string;

  @IsString()
  PAYMENTS_QUEUE!: string;
}

export class EnvironmentSettings {
  @IsEnum(Environments)
  ENV!: Environments;

  get isProduction() {
    return this.ENV === Environments.PRODUCTION;
  }
  get isDevelopment() {
    return this.ENV === Environments.DEVELOPMENT;
  }
}

export class Configuration {
  @ValidateNested()
  apiSettings!: ApiSettings;

  @ValidateNested()
  databaseSettings!: DatabaseSettings;

  @ValidateNested()
  filesServiceSettings!: FilesServiceSettings;

  @ValidateNested()
  rabbitMQSettings!: RabbitMQSettings;

  @ValidateNested()
  environmentSettings!: EnvironmentSettings;

  static create(environmentVariables: Record<string, string>): Configuration {
    const config = new Configuration();
    config.apiSettings = plainToInstance(ApiSettings, {
      PORT: Number(environmentVariables.PORT),
      LOCAL_HOST: environmentVariables.LOCAL_HOST,
    });

    config.databaseSettings = plainToInstance(DatabaseSettings, {
      DATABASE_URL: environmentVariables.DATABASE_URL,
    });

    config.filesServiceSettings = plainToInstance(FilesServiceSettings, {
      FILES_SERVICE_HOST: environmentVariables.FILES_SERVICE_HOST,
      FILES_SERVICE_PORT: Number(environmentVariables.FILES_SERVICE_PORT),
    });

    config.rabbitMQSettings = plainToInstance(RabbitMQSettings, {
      RABBITMQ_URL: environmentVariables.RABBITMQ_URL,
      PAYMENTS_QUEUE: environmentVariables.PAYMENTS_QUEUE,
    });

    config.environmentSettings = plainToInstance(EnvironmentSettings, {
      ENV: environmentVariables.ENV,
    });

    const errors = validateSync(config, { skipMissingProperties: false });
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return config;
  }
}