import { ApiProperty } from "@nestjs/swagger";

export class ReturnAccessJWTforSwagger {
  @ApiProperty({ example: 'string' })
  accessToken: string;
}