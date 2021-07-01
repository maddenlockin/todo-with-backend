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

    test('create todo', async() => {

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

      for (let todo of expectation) {
        await fakeRequest(app)
          .post('/api/todos')
          .send(todo)
          .set('Authorization', token)
          .expect('Content-Type', /json/)
          .expect(200);
      }
      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('get todos', async() => {

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
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('put todos', async() => {

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

      await fakeRequest(app)
        .put('/api/todos/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
