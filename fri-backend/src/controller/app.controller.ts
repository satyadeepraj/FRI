/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Delete,Patch, Param } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { Student } from '../entity/student.entity';

@Controller('students')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Body() student: Partial<Student>) {
    return this.appService.create(student);
  }

  @Get()
  findAll() {
    return this.appService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.appService.delete(id);
  }
   @Patch(':id')
   update(@Param('id') id: string, @Body() body: Partial<Student>) {
    return this.appService.updateStudent(Number(id), body);
  }
}
