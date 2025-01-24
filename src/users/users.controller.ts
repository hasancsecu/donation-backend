import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createDemoUser(createUserDto);
  }
}
