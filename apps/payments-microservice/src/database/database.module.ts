import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseConfig } from './database.config';
import { DatabaseConfigModule } from './database.config.module';

@Module({
	imports: [
		SequelizeModule.forRootAsync({
			inject: [DatabaseConfig],
			imports: [DatabaseConfigModule],
			useFactory: (databaseConfig: DatabaseConfig) => ({
				dialect: 'postgres',
				host: databaseConfig.dbHost,
				port: databaseConfig.dbPort,
				username: databaseConfig.dbUsername,
				password: databaseConfig.dbPassword,
				//database: databaseConfig.dbName,
				autoLoadModels: true,
				synchronize: true,
			}),
		}),
	],
	providers: [DatabaseConfig],
	exports: [],
})
export class DatabaseModule {}
