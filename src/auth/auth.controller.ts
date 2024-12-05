import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateAuthDto, LoginDto, ReguisterUserDto } from './dto/index.dto'
import { AuthGuard } from './guards/auth.guard';
import { LoguinRespounse } from './interfaces/loguin-response.interface';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  loguin(@Body() loginDto: LoginDto){
    return this.authService.loguin(loginDto);
  };

  @Post('/register')
  register(@Body() reguisterUserDto: ReguisterUserDto){
    return this.authService.register(reguisterUserDto);
  };

  @UseGuards( AuthGuard )
  @Get()
  findAll( @Request() req: Request ) {
    // const user = req['user']
    return this.authService.findAll();
  };

  @UseGuards( AuthGuard )
  @Get('/check-token')
  checkToken(@Request() req: Request): LoguinRespounse {
    const user = req['user'] as User;
    return {
      user,
      token: this.authService.getJwtToken({id: user._id})
    };
  };


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
