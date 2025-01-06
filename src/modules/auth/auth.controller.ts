import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { CognitoService } from 'src/common/cognito/cognito.service';

export type CreateEmployeeDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
};

export type SignInDto = {
  email: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cognitoService: CognitoService,
  ) {}

  // :TODO Add validation
  @Post('/sign-up')
  async register(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.authService.signUp(createEmployeeDto);
  }

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post('/refresh')
  @UseGuards(AuthGuard)
  async refresh(@Request() req, @Body() body) {
    const { sub } = req.user;
    const { refreshToken } = body;

    return await this.cognitoService.refresh(sub, refreshToken);
  }

  @Post('/request-reset-password')
  async requestResetPassword(@Body() body) {
    const { email } = body;

    return await this.cognitoService.initiateResetPassword(email);
  }
}
