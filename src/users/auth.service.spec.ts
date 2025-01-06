import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Auth service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users = [];

    //Create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        const foundUsers = users.filter((user) => user.email === email);
        return Promise.resolve(foundUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    //Create a DI for testing
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    //Get the auth service from it
    service = module.get(AuthService);
  });

  it('can create an instance of auth service ', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('asdf@asdf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if user signs up with an email that is already in use', async () => {
    fakeUsersService.find = (email: string) => {
      if (email === 'asdf@asdf.com') {
        return Promise.resolve([
          { id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User,
        ]);
      }
      return Promise.resolve([]);
    };

    await expect(
      service.signUp('asdf@asdf.com', 'asdf'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signIn('test@gem.com', 'test');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('throws if an invalid password is provided', async () => {
    try {
      await service.signUp('asdf@asdf.com', 'asdf');
      const user = await service.signIn('asdf@asdf.com', 'asdfrrr');
      console.log('------', user);
    } catch (error) {
      console.log('error');
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('Should log the user in', async () => {
    await service.signUp('asdf@asdf.com', 'asdf');
    const user = await service.signIn('asdf@asdf.com', 'asdf');
    expect(user).toBeDefined();
  });
});
