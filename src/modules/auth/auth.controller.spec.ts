import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { CognitoService } from '../../common/cognito/cognito.service';

describe('EmployeesController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [CognitoService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
