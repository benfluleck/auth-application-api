import bcrypt from 'bcryptjs';
import uuidv4 from 'uuidv4';

import Staff from '../models/staff'


export const signup = async (req, res) => {
  try {
    const {
      email, password, firstName, lastName
    } = req.body;


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

        res.status(201).json({ status: 'success', message: 'Staff Created Successfully', data: response });

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
      return res.status(404).json({ status: 'error', message: "This staff does not exist" });
    }

    const isMatch = await bcrypt.compare(password, staffExists.password)

    if (isMatch) {
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

