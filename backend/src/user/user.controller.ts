import { Controller, Get, Param, Post,Put, Delete, Body, UseGuards, BadRequestException, Res, Req, UnauthorizedException,  } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../db/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {Response, Request, response} from 'express';
import { request } from 'http';


@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  index(): Promise<User[]> {
    return this.userService.findAll();
  }  
  // @Get('verify')
  //   async user(@Req() request:Request) {
  //     try {
  //       const cookie = request.cookies['jwt'];

  //       const data = await this.jwtService.verifyAsync(cookie);

  //       if (!data) {
  //           throw new UnauthorizedException();
  //       }

  //       const user = await this.userService.findOne(data['id']);

  //       const {password, ...result} = user;

  //       return result;
  //   } catch (e) {
  //       throw new UnauthorizedException();
  //   }
  //   }
  @Get(':id')
  indexUser(@Param('id') id): Promise<User[] | string | User> {
    return this.userService.find(id);
  } 

  @Post('register')
    async register(@Body() userData: User): Promise<any> {
      const {id,name,email,password,role} =userData;

      const hashedPassword= await bcrypt.hash(password,12)
      return this.userService.create({...userData, password:hashedPassword});
    }
    
    @Put(':id/update')
    async update(@Param('id') id, @Body() userData: User): Promise<any> {
        userData.id = Number(id);
        console.log('Update #' + userData.id)
        return this.userService.update(userData);
    }
    
    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
      return this.userService.delete(id);
    }  

    @Post('login')
    async userLogin(@Body() {email, password}:{email:string; password:string},
    @Res({passthrough:true}) response:Response)
    {
      const user=await  this.userService.userLogin({email});

      if(!user || !await bcrypt.compare(password,user.password))
      {
        throw new BadRequestException('invalid credentials')
      }

      // const jwt = await this.jwtService.signAsync({id:user.id})
     
      // response.cookie('jwt', jwt, {httpOnly: true});

        return {
            message: 'success',
            user:user
        };

     }

     @Post('logout')
    async logout(@Res({passthrough: true}) response: Response,@Req() request:Request) {
      console.log(request)
        // response.clearCookie('jwt');
        return {
            message: 'cleared',
            // respose:response.cookie
        }
    }


}
