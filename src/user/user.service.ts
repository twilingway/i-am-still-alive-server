import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(id: UUID) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not fount');

    return user;
  }

  async create(createUserDto: CreateUserDto, ip: string) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUser) {
      throw new BadRequestException('This email already exist!');
    }

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await argon2.hash(createUserDto.password),
        ip,
      },
    });

    const { id } = user;
    const access_token = this.jwtService.sign({ email: createUserDto.email });
    return { user: { id }, access_token };
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async update(id: UUID, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ip: updateUserDto.ip,
      },
    });
  }

  remove(id: UUID) {
    return `This action removes a #${id} user`;
  }
}
