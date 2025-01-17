import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { CognitoService } from '../../common/cognito/cognito.service';

describe('EmployeesController', () => {
  let controller: EmployeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [CognitoService],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
