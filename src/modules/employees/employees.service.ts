import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prismaService: PrismaService) {}

  async getEmployeeBySub(sub: string) {
    return await this.prismaService.employee.findFirst({ where: { sub } });
  }
}
