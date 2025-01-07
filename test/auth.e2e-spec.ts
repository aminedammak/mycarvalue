import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handle a Sign up request ', () => {
    const email = 'hedi6@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'azerty123',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('Signup and the return the current user', async () => {
    const email = 'hedi6@gmail.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'azerty123',
      })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
