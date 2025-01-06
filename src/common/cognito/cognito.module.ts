import { Module } from '@nestjs/common';
import { CognitoService } from './cognito.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [CognitoService, ConfigService],
  exports: [CognitoService],
})
export class CognitoModule {}
