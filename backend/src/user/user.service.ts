import { HttpException, Injectable, Response } from '@nestjs/common';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../db/user.entity';
import { UpdateResult, DeleteResult } from  'typeorm';
import * as jwt from 'jsonwebtoken'

const User1=[
  {
  name:'Hello',
  email:'a@gmail.com',
  id:1,
  password:'sahdev'
},
{
  name:'yello',
  email:'y@gmail.com',
  id:2,
  password:'rai'
}]


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
) { }



  async  findAll(): Promise<User[]> {
    return await this.userRepository.find();
}

async  find(id: any): Promise<User[] | User | string> {
  const user= await this.userRepository.find();
  for(const iter of user)
    {
      if(iter.id==id)
      { 
          return iter
      }
    }
    return 'no user found'
 
}

async  create(user: User): Promise<User> {
    return await this.userRepository.save(user);
}

async update(user: User): Promise<UpdateResult> {
    return await this.userRepository.update(user.id, user);
}

async delete(id: string | number| FindOptionsWhere<User>): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
}
 
async userLogin({ email}:{ email: string;}):Promise<User> {
  const user= await this.userRepository.findOne({where: {email:email}});

  if(!user)
  {
     throw new HttpException('invalid credetials',400)
  }
  else {
    return user
  }
  
}

async findOne(condition: any): Promise<User> {
  return this.userRepository.findOne({where: {id:condition}});
}
}
  