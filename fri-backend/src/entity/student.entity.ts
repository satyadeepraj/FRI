/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tree')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  
  @Column({ nullable: true })
  rollNo: string;
  
  @Column({ nullable: true })
  email: string;
  
  @Column({ nullable: true })
  address: string;
  
  @Column({ nullable: true })
  phoneNumber: string;
  
  @Column({ nullable: true })
  fatherName: string;
  
  @Column({ nullable: true })
  motherName: string;
}
