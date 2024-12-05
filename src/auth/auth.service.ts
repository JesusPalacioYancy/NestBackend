import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcryptjs  from 'bcryptjs';

import { CreateUserDto, UpdateAuthDto, LoginDto, ReguisterUserDto } from './dto/index.dto'
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoguinRespounse } from './interfaces/loguin-response.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name ) 
    private userModel: Model<User>,
    private jwtService: JwtService
  ){};

  // Crear usuarios y contraseñas incriptadas
  async create(createUserDto: CreateUserDto): Promise<User> {
    try{
      const {password, ...userData} = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });
      await newUser.save();  
      const {password:_, ...user} = newUser.toJSON();
      return user;
    }
    catch(err) {
      if( err.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } already email`);
      }; 
      throw new InternalServerErrorException('Something terribe happen!!!');
    };   
  };

  // Reguistrar la creacion del usuario
  async register(reguisterUserDto: ReguisterUserDto): Promise<LoguinRespounse> {
    const user = await this.create( reguisterUserDto );
    return {
      user: user,
      token: this.getJwtToken({id: user._id})
    };
  };

  // Verificacion del usario creado
  async loguin(loginDto: LoginDto): Promise<LoguinRespounse> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if(!user){ throw new UnauthorizedException('Not valid credentials - email'); };

    if(!bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Not valid credentials - password');
    };

    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id })
    };
  };

  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    const userdestructuring = users.map(user => {
      const {password, ...rest} = user.toJSON();
      return rest;
    });
    return userdestructuring;
  };

  // Obtnere un usuario 
  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    const { password, ...dataUser } = user.toJSON();
    return dataUser;
  };

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  // Obtener token del usuario 
  getJwtToken(payload : JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  };

};
