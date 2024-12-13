import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from 'apps/main-gateway/src/config/config-validation.utility';
import { IsString } from 'class-validator';

@Injectable()
export class AuthConfig {
  @IsString()
  secretAccess: string;

  @IsString()
  secretRefresh: string;

  @IsString()
  accessExpiresIn: string;

  @IsString()
  refreshExpiresIn: string;

  constructor(private configService: ConfigService) {
    const secretAccess = this.configService.get('JWT_SECRET_ACCESS');
    if (secretAccess === undefined) {
      throw new Error('JWT_SECRET_ACCESS is not defined');
    }
    this.secretAccess = secretAccess;

    const secretRefresh = this.configService.get('JWT_SECRET_REFRESH');
    if (secretRefresh === undefined) {
      throw new Error('JWT_SECRET_REFRESH is not defined');
    }
    this.secretRefresh = secretRefresh;

    const accessExpiresIn = this.configService.get('JWT_ACCESS_EXPIRES_IN');
    if (accessExpiresIn === undefined) {
      throw new Error('JWT_ACCESS_EXPIRES_IN is not defined');
    }
    this.accessExpiresIn = accessExpiresIn;

    const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN');
    if (refreshExpiresIn === undefined) {
      throw new Error('JWT_REFRESH_EXPIRES_IN is not defined');
    }
    this.refreshExpiresIn = refreshExpiresIn;

    configValidationUtility.validateConfig(this);
  }
}