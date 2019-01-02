import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';

import app from '../index';

chai.use(chaiHttp);

const userDetails = {
  password: 'boooboo',
  firstName: 'Benny',
  lastName: 'Ogidan',
  email: 'benny.ogidan@hotmail.com',
}

describe('Authentication', () => {
  it(
    'should return a 201 status code when a regular staff is created',
    (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send({
          ...userDetails
        })
        .then((res) => {
          expect(res.status)
            .to
            .equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Staff Created Successfully')
          done();
        }).catch((err) => {
          done(err)
        })
    }
  );
  it('should throw a validation error for invalid staff data', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        firstName: faker
          .name
          .firstName(),
        lastName: faker
          .name
          .lastName(),
        password: 'password',
        email: ''
      })
      .then((res) => {
        expect(res.body.error.email).to.equal('Please provide a valid email address');
        expect(res.body.message).to.equal('An error has occured');
        expect(res.status)
          .to
          .equal(400);
        done();
      }).catch((err) => {
        done(err)
      })
  });
  it('should throw a validation error for invalid staff data', (done) => {
    const email = 'nenemail.com';
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        firstName: faker
          .name
          .firstName(),
        lastName: faker
          .name
          .lastName(),
        password: 'password',
        email
      })
      .then((res) => {
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('This email address you have provided is invalid');
        expect(res.status)
          .to
          .equal(422);
        done();
      }).catch((err) => {
        done(err)
      })
  });
  it('should respond with 400 status code if bad username or password',
    (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send({
          password: faker
            .internet
            .password()
        })
        .then((res) => {
          expect(res.body.error.email).to.equal('Please provide a valid email address');
          expect(res.status)
            .to
            .equal(400);
          done();
        }).catch((err) => {
          done(err)
        })
    }
  );
  it('should return 403 when a regular staff signs in but has not confirmed their email', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({ email: userDetails.email, password: userDetails.password })
      .then((res) => {
        expect(res.body.message).to.equal('Please Confirm Your Email Address');
        expect(res.status)
          .to
          .equal(403);
        done();
      }).catch((err) => {
        done(err)
      })
  });

  it('should throw a 401 error for Users that do not exist', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({ email: 'UnknownUser@mail.com', password: 'error' })
      .then((res) => {
        expect(res.body.message)
          .to
          .equal('Wrong Credentials');
        expect(res.status)
          .to
          .equal(401);
        done();
      })
      .catch((err) => {
        done(err)
      })
  });
  it('should return a 400 error for an invalid password', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({ email: 'Benny', password: '' })
      .then((res) => {
        expect(res.body.message)
          .to
          .equal('An error has occured');
        expect(res.body.error.password).to.equal('Please enter a valid password');
        expect(res.status)
          .to
          .equal(400);
        done();
      })
      .catch((err) => {
        done(err)
      })
  });
  it('should return a 401 error for an Invalid password',
    (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send({ email: 'benny.ogidan@hotmail.com', password: 'nnnnnnn' })
        .then((res) => {
          expect(res.status)
            .to
            .equal(401);
          expect(res.body.status)
            .to
            .equal('error');
          expect(res.body.message).to.equal('Wrong Credentials')
          done();
        });
    }
  );
  it('should check for unique emails', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        firstName: 'Benn',
        lastName: 'Nyotu',
        email: 'benny.ogidan@hotmail.com',
        password: 'benny',
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .equal(409);
        expect(res.body.message).to.equal('This email is already in use');
        done();
      });
  });
});

