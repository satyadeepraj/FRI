/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from '../service/app.service';
import { Student } from '../entity/student.entity';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockStudent: Student = {
    id: 1,
    name: 'John Doe',
    rollNo: '101',
    email: 'john@example.com',
    address: '123 Street',
    phoneNumber: '1234567890',
    fatherName: 'Mr. Doe',
    motherName: 'Mrs. Doe',
  };

  const mockAppService = {
    create: jest.fn().mockImplementation((dto) => ({
      id: 1,
      ...dto,
    })),
    findAll: jest.fn().mockResolvedValue([mockStudent]),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new student', async () => {
      const dto = { ...mockStudent };
      delete dto.id;

      const result = await appController.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(appService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of students', async () => {
      const result = await appController.findAll();
      expect(result).toEqual([mockStudent]);
      expect(appService.findAll).toHaveBeenCalled();
    });
  });

  describe('delete()', () => {
    it('should delete a student by ID', async () => {
      const result = await appController.delete(1);
      expect(result).toEqual({ affected: 1 });
      expect(appService.delete).toHaveBeenCalledWith(1);
    });
  });
});
