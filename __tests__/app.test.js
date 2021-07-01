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

    test('post todos', async() => {

      const expectation = [
        {
          'id': 4,
          'todo': 'laundry',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 5,
          'todo': 'sort mail',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 6,
          'todo': 'dust',
          'completed': false,
          'owner_id': 2
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
      console.log(data.body);
      expect(data.body).toEqual(expectation);
    });

    test('get todos', async() => {

      const expectation = [
        {
          'id': 4,
          'todo': 'laundry',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 5,
          'todo': 'sort mail',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 6,
          'todo': 'dust',
          'completed': false,
          'owner_id': 2
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      console.log(data.body);
      expect(data.body).toEqual(expectation);
    });

    test('put todos', async() => {

      const expectation = [
        {
          'id': 5,
          'todo': 'sort mail',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 6,
          'todo': 'dust',
          'completed': false,
          'owner_id': 2
        },
        {
          'id': 4,
          'todo': 'laundry',
          'completed': true,
          'owner_id': 2
        },
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
      console.log(data.body);
      expect(data.body).toEqual(expectation);
    });
  });
});
