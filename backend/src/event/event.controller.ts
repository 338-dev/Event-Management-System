import { Controller, Get, Param, Post,Put, Delete, Body, UseGuards, BadRequestException, Res, Req, UnauthorizedException,  } from '@nestjs/common';
import { EventService } from './event.service';
import { User } from '../db/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {Response, Request, response} from 'express';
import { request } from 'http';
import { Event } from 'src/db/event.entity';


@Controller('/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}


  @Get()
  index(): Promise<Event[]> {
    return this.eventService.findAll();
  }  

  @Post('create')
    async register(@Body() eventData: Event): Promise<any> {
      
      return this.eventService.createEvent(eventData);
    }

    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
      return this.eventService.delete(id);
    } 

    @Get(':id')
  indexUser(@Param('id') id): Promise<Event[] | string | Event> {
    return this.eventService.find(id);
  } 

  @Put(':id/update')
    async update(@Param('id') id, @Body() eventData: Event): Promise<any> {
        eventData.id = Number(id);
        console.log('Update #' + eventData.id)
        return this.eventService.update(eventData);
    }

}
