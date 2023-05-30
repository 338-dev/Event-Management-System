import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Event } from 'src/db/event.entity';
import { EventService } from 'src/event/event.service';
import { EventController } from 'src/event/event.controller';
import { TagsAndCategory } from 'src/db/tagsAndCategory.entity';
import { TNCController } from 'src/tagsAndCategory/tagsAndCategory.controller';
import { TNCService } from 'src/tagsAndCategory/tagsAndCategory.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Event,TagsAndCategory]),
    /*JwtModule.register({
        secret:'secret',
        signOptions:{expiresIn:'1d'}
    })*/
  ],
  providers: [UserService,EventService,TNCService],
  controllers: [UserController,EventController,TNCController]
})
export class UserModule {}