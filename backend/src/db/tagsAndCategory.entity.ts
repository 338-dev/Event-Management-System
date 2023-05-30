import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';


@Entity()
export class TagsAndCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tags: string;

    @Column()
    category: string;

}