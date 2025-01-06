import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('Auth service', () => {
  let service: AuthService;

  beforeEach(async () => {
    //Create a fake copy of the users service
    const fakeUsersService: Partial<UsersService> = {
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
});
