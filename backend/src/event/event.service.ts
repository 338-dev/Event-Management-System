import { HttpException, Injectable, Response } from '@nestjs/common';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../db/user.entity';
import { UpdateResult, DeleteResult } from  'typeorm';
import * as jwt from 'jsonwebtoken'
import { Event } from 'src/db/event.entity';



@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
) { }


  async  findAll(): Promise<Event[]> {
    return await this.eventRepository.find();
}

async  createEvent(event:Event): Promise<Event> {
    return await this.eventRepository.save(event);
}

async delete(id: string | number| FindOptionsWhere<Event>): Promise<DeleteResult> {
    return await this.eventRepository.delete(id);
}

async find(condition: any): Promise<Event[]> {
    return this.eventRepository.find(condition);
  }
async update(event: Event): Promise<UpdateResult> {
    return await this.eventRepository.update(event.id, event);
} 
}
