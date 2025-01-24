import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'user',
  ) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return await this.userRepository.save(user);
  }

  async createDemoUser(createUserDto: CreateUserDto) {
    const { name, email, password, role } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async getTotalUsers() {
    const totalUsers = await this.userRepository.count();
    return totalUsers;
  }

  async getTodayUsers() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayUsers = await this.userRepository.count({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    return todayUsers;
  }
}
