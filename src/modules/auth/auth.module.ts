import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CognitoModule } from 'src/common/cognito/cognito.module';
import { EmployeesService } from '../employees/employees.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmployeesService],
  imports: [CognitoModule],
})
export class AuthModule {}
