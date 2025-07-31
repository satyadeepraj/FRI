/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entity/student.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  create(student: Partial<Student>) {
    const newStudent = this.studentRepository.create(student);
    return this.studentRepository.save(newStudent);
  }

  findAll() {
    return this.studentRepository.find();
  }

  delete(id: number) {
    return this.studentRepository.delete(id);
  }
  async updateStudent(id: number, updateData: Partial<Student>): Promise<Student> {
  const student = await this.studentRepository.findOne({ where: { id } });

  if (!student) {
    throw new Error(`Student with id ${id} not found`);
  }

  const updatedStudent = Object.assign(student, updateData);
  return await this.studentRepository.save(updatedStudent);
}

}
