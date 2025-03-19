import {
  IntegrationTestContext,
  setupIntegrationTest,
} from 'shared/test-helpers/test-integration-setup.helper';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { getAuthToken } from 'shared/test-helpers/get-token-auth.helper';
import { loadFixtures } from 'activity/interface/activity.fixture';

describe('Activity', () => {
  let ctx: IntegrationTestContext;
  let token;

  beforeEach(async () => {
    ctx = await setupIntegrationTest(loadFixtures);
    token = await getAuthToken(ctx.app, 'patria@patria.com', '12345');
  });

  afterEach(async () => {
    await ctx.cleanup();
  });

  describe('POST /v1/activities', () => {
    it(`Should create a successful Activity`, async () => {
      const { body } = await request(ctx.app.getHttpServer())
        .post(`/v1/activities`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Nome teste',
          description: 'descrição teste',
        });


      const { result } = body;

      expect(result).toHaveProperty('uuid');
      expect(result.uuid).not.toEqual('');
      expect(result.uuid).not.toBeNull();
    });

    it(`should throw exception when request body is empty`, async () => {
      const { body } = await request(ctx.app.getHttpServer())
        .post(`/v1/activities`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(HttpStatus.BAD_REQUEST);

      expect(body.message).toEqual('name must be a string, name should not be empty');
    });
  });
});
