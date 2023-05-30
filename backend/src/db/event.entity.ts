import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';


@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    creator: string;
    
    @Column()
    description: string;
    
    @Column()
    address: string;

    @Column()
    category: string;

    @Column()
    tags: string;

    @Column()
    eventType: string;

    @Column()
    date: string;

    @Column()
    favourite: string;

}