import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException } from '@nestjs/common';

describe('Auth service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    //Create a fake copy of the users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
});
