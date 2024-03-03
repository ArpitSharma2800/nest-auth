import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/public.decorator';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { encryptConstants } from './constants/constant';
import { Role } from 'src/auth/Roles/role.enum';
import { Roles } from 'src/auth/Roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const ivData = randomBytes(16);
    const saltData = randomBytes(16).toString('base64');
    const passwordToEncrypt = createUserDto.password;
    const combinedPassword = createUserDto.password + encryptConstants.secret;

    const key = (await promisify(scrypt)(combinedPassword, saltData, 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, ivData);

    const encryptedPassword = Buffer.concat([
      cipher.update(passwordToEncrypt),
      cipher.final(),
    ]);
    const userCreatedInfo = await this.usersService.createUser({
      ...createUserDto,
      password: encryptedPassword.toString('base64'),
      keyDerivationInfo: key.toString('base64'),
      iv: ivData.toString('base64'),
      salt: saltData
    })

    const { keyDerivationInfo, password, iv, salt, ...responseWithoutSensitiveInfo } = userCreatedInfo;
    return responseWithoutSensitiveInfo;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  @Roles(Role.BranchManager)
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
