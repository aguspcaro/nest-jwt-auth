import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';
import { compare } from 'bcrypt';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.usersRepository.find();
  }

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin;
    const findUser = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!findUser) throw new HttpException('User not found', 404);
    const checkPassword = await compare(password, findUser.password);
    if (!checkPassword) throw new HttpException('Invalid credentials', 403);

    const payload = { id: findUser.id, name: findUser.firstName };
    const token = this.jwtService.sign({ id: payload });
    const data = { user: findUser, token };
    return data;
  }

  async create(userObjectRegister: RegisterAuthDto) {
    const findUser = await this.usersRepository.findOne({
      where: {
        email: userObjectRegister.email,
      },
    });
    if (findUser) throw new HttpException('User already created', 404);

    return this.usersRepository.save(userObjectRegister);
  }
}
