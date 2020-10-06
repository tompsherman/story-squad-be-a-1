const request = require('supertest');
const server = require('../../api/app');

// Import test data
const {
  parents,
  newParentName: Name,
  badRequest,
} = require('../../data/testdata');

module.exports = () => {
  describe('parents router endpoints', () => {
    describe('GET /parents', () => {
      it('returns a 200 and empty array on success', async () => {
        const res = await request(server).get('/parents');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
      });
    });

    describe('POST /parents', () => {
      it('should successfully post a new user', async () => {
        const res = await request(server).post('/parent').send(parents[0]);

        expect(res.status).toBe(201);
        expect(res.body).toBe(1);
      });

      it('should successfully post a second user', async () => {
        const res = await request(server).post('/parent').send(parents[1]);

        expect(res.status).toBe(201);
        expect(res.body).toBe(2);
      });

      it('should restrict creation of parent with duplicate email', async () => {
        const res = await request(server).post('/parent').send(parents[0]);

        expect(res.status).toBe(403);
      });

      it('should return a 400 on poorly-formatted parent', async () => {
        const res = await request(server).post('/parent').send(badRequest);

        expect(res.status).toBe(400);
      });
    });

    describe('GET /parents/:id', () => {
      it('should have successfully added the user to the database', async () => {
        const res = await request(server).get('/parents/1');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ID: 1, ...parents[0] });
      });

      it('should return a 404 when retrieving a nonexistent parent', async () => {
        const res = await request(server).get('/parents/3');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('ParentNotFound');
      });
    });

    describe('GET /parents/profiles', () => {
      it('should pull all profiles related to a parent account', async () => {
        const res = await request(server).get('/profiles');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].type).toBe('Parent');
      });
    });

    describe('PUT /parents/:id', () => {
      it('should successfully update a parent', async () => {
        const res = await request(server).put('/parent/1').send({ Name });

        expect(res.status).toBe(204);
        expect(res.body).toEqual({});
      });

      it('should return a 404 on invalid parent id', async () => {
        const res = await request(server).put('/parent/3').send(parents[0]);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('ParentNotFound');
      });

      it('should return a 400 on poorly-formatted data', async () => {
        const res = await request(server).put('/parent/1').send(badRequest);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('InvalidParent');
      });
    });

    describe('DELETE /parents/:id', () => {
      it('should delete a parent from the database', async () => {
        const res = await request(server).delete('/parent/2');

        expect(res.status).toBe(204);
      });

      it('should return a 404 on invalid id', async () => {
        const res = await request(server).delete('/parent/2');

        expect(res.status).toBe(404);
      });
    });
  });
};
