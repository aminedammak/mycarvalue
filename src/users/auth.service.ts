import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException();
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const user = await this.usersService.create(email, result);
    return user;
  }

  async signIn(email: string, password: string) {
    // Find a user with this email
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('email not found');
    }

    // get the saved password and extract from it the salt
    const [salt, savedHash] = user.password.split('.');

    // hash the enterd password with this salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // check if the hashed password is equal to the one in the database
    if (hash.toString('hex') !== savedHash) {
      console.log('wrong passsss');
      throw new BadRequestException('Wrong password');
    }

    return user;
  }
}
