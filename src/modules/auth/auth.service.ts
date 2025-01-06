import { Injectable } from '@nestjs/common';
import { CognitoService } from 'src/common/cognito/cognito.service';
import { CreateEmployeeDto, SignInDto } from './auth.controller';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private cognitoService: CognitoService,
    private prismaService: PrismaService,
  ) {}

  async signUp(employeeDto: CreateEmployeeDto) {
    const { UserSub: sub } = await this.cognitoService.signUp(employeeDto);

    const { organizationName: name, ...rest } = employeeDto;

    return this.prismaService.$transaction(async (tx) => {
      const { id: ownerId } = await tx.employee.create({
        data: { ...rest, sub },
      });

      await tx.organization.create({ data: { name, ownerId } });
    });
  }

  async signIn(signInDto: SignInDto) {
    // :TODO Check if user exists in our db
    // :TODO Remove password from our db, password should be only checked in Cognito
    return await this.cognitoService.signIn(signInDto);
  }
}
