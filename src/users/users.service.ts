import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, QueryFailedError } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) { }


  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      if (!createUserDto) {
        throw new Error('User data is null or undefined');
      }
      const newUser = this.dataSource.manager.create(User, createUserDto);
      const saveUser = await this.dataSource.manager.save(User, newUser);
      return saveUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new Error('Database query failed');
      } else if (error.message === 'User data is null or undefined') {
        throw new Error('User data cannot be null or undefined');
      } else if (error instanceof Error) {
        throw new Error('Could not create user');
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<User | undefined> {
    try {
      const user = await this.dataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.userID = :id", { id })
        .getOne();
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        console.error('Database query failed:', error);
        throw new Error('Database query failed');
      } else {
        console.error('Unknown error:', error);
        throw new Error('An unknown error occurred');
      }
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.dataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.userEmail = :email", { email })
        .getOne();
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        console.error('Database query failed:', error);
        throw new Error('Database query failed');
      } else {
        console.error('Unknown error:', error);
        throw new Error('An unknown error occurred');
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.dataSource
      .getRepository(User)
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where("userID = :id", { id })
      .execute()

    return updatedUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
