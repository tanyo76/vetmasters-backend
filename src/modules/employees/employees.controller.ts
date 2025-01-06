import { Controller } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Controller('employees')
export class EmployeesController {
  constructor(private prismaService: PrismaService) {}
}
