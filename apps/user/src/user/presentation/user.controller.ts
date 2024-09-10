import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../domain/user.service';
import { CreateUserDto } from './DTO/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createUser')
  createUser(@Body() createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    const password = createUserDto.password;
    this.userService.createUser({ email, password });
  }
}
