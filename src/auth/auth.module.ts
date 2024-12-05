import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { User , UserShema } from './entities/user.entity'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [

    ConfigModule.forRoot(),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserShema
      }
    ]),

    JwtModule.register({
      secret: process.env.JWT_SEED,
      global: true,
      signOptions: { expiresIn: '6h' },
    }),
  ],

})
export class AuthModule {}
