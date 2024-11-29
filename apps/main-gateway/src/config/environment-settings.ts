import { Environments } from "./configuration";
import { IsEnum } from "class-validator";

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