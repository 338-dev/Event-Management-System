import { HttpException, Injectable, Response } from '@nestjs/common';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../db/user.entity';
import { UpdateResult, DeleteResult } from  'typeorm';
import * as jwt from 'jsonwebtoken'
import { TagsAndCategory } from 'src/db/tagsAndCategory.entity';



@Injectable()
export class TNCService {
  constructor(
    @InjectRepository(TagsAndCategory)
    private TNCRepository: Repository<TagsAndCategory>,
) { }


  async  findAll(): Promise<TagsAndCategory[]> {
    return await this.TNCRepository.find();
}

async  createEvent(tnc:TagsAndCategory): Promise<TagsAndCategory> {
    return await this.TNCRepository.save(tnc);
}

async update(event: TagsAndCategory): Promise<UpdateResult> {
    return await this.TNCRepository.update(event.id, event);
} 

}
