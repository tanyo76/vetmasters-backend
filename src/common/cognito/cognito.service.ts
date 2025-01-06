import {
  AdminDeleteUserCommand,
  AdminDeleteUserCommandInput,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandInput,
  ForgotPasswordCommand,
  ForgotPasswordCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { CreateEmployeeDto, SignInDto } from 'src/modules/auth/auth.controller';

@Injectable()
export class CognitoService {
  private readonly cognitoClient: CognitoIdentityProviderClient;
  private cognitoClientId: string;
  private cognitoClientSecret: string;
  private cognitoRegion: string;
  private cognitoUserPoolId: string;

  constructor(private configService: ConfigService) {
    this.cognitoClientId = this.configService.get('COGNITO_CLIENT_ID');
    this.cognitoClientSecret = this.configService.get('COGNITO_CLIENT_SECRET');
    this.cognitoRegion = this.configService.get('COGNITO_REGION');
    this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.cognitoRegion,
    });
  }

  private generateSecretHash(uniqueIdentifier: string) {
    return createHmac('sha256', this.cognitoClientSecret)
      .update(uniqueIdentifier + this.cognitoClientId)
      .digest('base64');
  }

  async signUp(cognitoSignUpDto: CreateEmployeeDto) {
    const { email, password } = cognitoSignUpDto;

    const params: SignUpCommandInput = {
      ClientId: this.cognitoClientId,
      SecretHash: this.generateSecretHash(email),
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    return await this.cognitoClient.send(new SignUpCommand(params));
  }

  async signIn(cognitoSignInDto: SignInDto) {
    const { email, password } = cognitoSignInDto;

    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.cognitoClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.generateSecretHash(email),
      },
    };

    const { AuthenticationResult } = await this.cognitoClient.send(
      new InitiateAuthCommand(params),
    );

    return AuthenticationResult;
  }

  async deleteCognitoUser(email: string) {
    const params: AdminDeleteUserCommandInput = {
      Username: email,
      UserPoolId: this.cognitoUserPoolId,
    };

    await this.cognitoClient.send(new AdminDeleteUserCommand(params));
  }

  async refresh(sub: string, refreshToken: string) {
    const params: InitiateAuthCommandInput = {
      ClientId: this.cognitoClientId,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: this.generateSecretHash(sub),
      },
    };

    const { AuthenticationResult } = await this.cognitoClient.send(
      new InitiateAuthCommand(params),
    );

    return AuthenticationResult;
  }

  async initiateResetPassword(email: string) {
    const params: ForgotPasswordCommandInput = {
      ClientId: this.cognitoClientId,
      Username: email,
      SecretHash: this.generateSecretHash(email),
    };

    return await this.cognitoClient.send(new ForgotPasswordCommand(params));
  }

  async confirmResetPassword(
    email: string,
    password: string,
    confirmationCode: string,
  ) {
    const params: ConfirmForgotPasswordCommandInput = {
      ClientId: this.cognitoClientId,
      Username: email,
      Password: password,
      SecretHash: this.generateSecretHash(email),
      ConfirmationCode: confirmationCode,
    };

    return await this.cognitoClient.send(
      new ConfirmForgotPasswordCommand(params),
    );
  }

  async resendConfirmationCode(email: string) {
    const params: ResendConfirmationCodeCommandInput = {
      Username: email,
      ClientId: this.cognitoClientId,
      SecretHash: this.generateSecretHash(email),
    };

    return await this.cognitoClient.send(
      new ResendConfirmationCodeCommand(params),
    );
  }
}
