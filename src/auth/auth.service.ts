import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersService,
  ) {}

  async register(userObject: RegisterAuthDto) {
    const { password } = userObject;

    const randomNumber = 10;
    const plainToHash = await hash(password, randomNumber);

    userObject = {
      ...userObject,
      password: plainToHash,
    };

    return this.usersRepository.create(userObject);
  }

  async login(userObjectLogin: LoginAuthDto) {
    return await this.usersRepository.login(userObjectLogin);
  }
}
