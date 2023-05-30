import { Controller, Get, Param, Post,Put, Delete, Body, UseGuards, BadRequestException, Res, Req, UnauthorizedException,  } from '@nestjs/common';
import { TNCService } from './tagsAndCategory.service'
import { User } from '../db/user.entity';
// import * as jwt from 'jsonwebtoken'
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {Response, Request, response} from 'express';
import { request } from 'http';
import { TagsAndCategory } from 'src/db/tagsAndCategory.entity';


@Controller('/tnc')
export class TNCController {
  constructor(private readonly tncService: TNCService) {}


  @Get()
  index(): Promise<TagsAndCategory[]> {
    return this.tncService.findAll();
  }  

  @Post('create')
    async register(@Body() tncData: TagsAndCategory): Promise<any> {
      
      return this.tncService.createEvent(tncData);
    }
    @Put(':id/update')
    async update(@Param('id') id, @Body() tncData: TagsAndCategory): Promise<any> {
        tncData.id = Number(id);
        console.log('Update #' + tncData.id)
        return this.tncService.update(tncData);
    }

}
