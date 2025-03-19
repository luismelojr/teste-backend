import {
  IntegrationTestContext,
  setupIntegrationTest,
} from 'shared/test-helpers/test-integration-setup.helper';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { loadFixtures } from '../interface/occupation.fixture';
import { getAuthToken } from 'shared/test-helpers/get-token-auth.helper';

describe('Occupation', () => {
  let ctx: IntegrationTestContext;
  let token;

  beforeEach(async () => {
    ctx = await setupIntegrationTest(loadFixtures);
    token = await getAuthToken(ctx.app, 'patria@patria.com', '12345');
  });

  afterEach(async () => {
    await ctx.cleanup();
  });

  describe('POST /v1/occupations', () => {
    it(`Should create a successful Occupation`, async () => {
      const { body } = await request(ctx.app.getHttpServer())
        .post(`/v1/occupations`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Nome teste',
          description: 'descrição teste',
        })
        .expect(HttpStatus.CREATED);

      const result = body.result;

      expect(result).toHaveProperty('uuid');
      expect(result.uuid).not.toEqual('');
      expect(result.uuid).not.toBeNull();

      expect(result.name).toEqual('Nome teste');
      expect(result.description).toEqual('descrição teste');


    });

    it(`should throw exception when request body is empty`, async () => {
      const { body } = await request(ctx.app.getHttpServer())
        .post(`/v1/occupations`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(HttpStatus.BAD_REQUEST);

      expect(body.message).toEqual('name must be a string, name should not be empty');
    });
  });
});
