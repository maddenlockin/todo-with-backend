require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns todos', async() => {

      const expectation = [
        {
          'id': 1,
          'todo': 'laundry',
          'completed': false,
          'owner_id': 1
        },
        {
          'id': 2,
          'todo': 'sort mail',
          'completed': false,
          'owner_id': 1
        },
        {
          'id': 3,
          'todo': 'dust',
          'completed': false,
          'owner_id': 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/todos')
        //.set('Authorization')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
