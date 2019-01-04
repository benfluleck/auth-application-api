import bcrypt from 'bcryptjs';
import uuidv4 from 'uuidv4';
import Redis from 'ioredis';

import Staff from '../models/staff'
import { createConfirmEmailLink } from '../config/createConfirmationLink';
import { sendConfirmationEmail } from '../email/confirmationEmail/email';
import { inValidEmailErrorMessages, validateEmail }  from '../validators/validation'

const redis = new Redis()

export const signup = async (req, res) => {
  try {
    const {
      email, password, firstName, lastName
    } = req.body;

     if (!validateEmail(email)){
       return res.status(422).json({ status: 'error', message: inValidEmailErrorMessages });
     }


    const staffExists = await Staff.query().findOne({ email })

    if (staffExists) {
      return res.status(409).json({ status: 'error', message: "This email is already in use" });
    }
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    bcrypt.genSalt(10, async (err, salt) => {
      if (err) {
        return res.status(400).json({ status: 'error', message: 'Password Error, Please try again' });
      }

      bcrypt.hash(data.password, salt, async (error, hash) => {
        if (error) {
          throw error;
        }
        data.password = hash;
        const newStaff = {
          id: uuidv4(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
          password: data.password,
        };

        const createdStaff = await Staff
          .query()
          .allowInsert('[id, firstName, lastName, email, password]')
          .insert(newStaff)

          const { password, ...response } = createdStaff

          const confirmedUrl = req.protocol + '://' + req.get('host');

        if(process.env.NODE_ENV !== "test") {
          const confirmationLink = await createConfirmEmailLink(confirmedUrl, response.id, redis)
          sendConfirmationEmail(response.email, response.firstName, confirmationLink)
        }

        res.status(201).json({
        status: 'success',
        message: 'Staff Created Successfully',
        data: response
      });
      });
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staffExists = await Staff.query().findOne({ email })

    if (!staffExists) {
      return res.status(401).json({ status: 'error', message: 'Wrong Credentials'  });
    }



    const isMatch = await bcrypt.compare(password, staffExists.password)

    if (isMatch) {

      if(!staffExists.hasConfirmed) {
        return res.status(403).json({ status: 'error', message: "Please Confirm Your Email Address" });
      }

      req.session && (req.session.staffId = staffExists.id)

      res.json({
        status: 'success', message: `Welcome ${staffExists.firstName}`,
        data: {
          id: staffExists.id
        }
      });
    } else {
      return res.status(401).json({ status: 'error', message: 'Wrong Credentials' });
    }
  } catch {
    res.status(400).json({ status: 'error', message: error.message })
  }
};

