import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EmployeesService } from 'src/modules/employees/employees.service';
import {
  convertJwkToPem,
  decodeJwt,
  getJwtKeys,
  verifyJwtToken,
} from 'src/utils/jwt.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private employeeService: EmployeesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers?.authorization;

    const accessToken = authHeader?.split(' ')[1];

    if (!authHeader || !accessToken) {
      throw new UnauthorizedException();
    }

    const keys = await getJwtKeys();
    const { header } = decodeJwt(accessToken);

    const key = keys.get(header.kid);

    const pem = convertJwkToPem(key);

    const sub = verifyJwtToken(accessToken, pem);

    const user = await this.employeeService.getEmployeeBySub(sub);

    request.user = user;

    return !!request?.user;
  }
}
