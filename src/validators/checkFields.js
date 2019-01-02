import isEmpty  from 'lodash.isempty';
import { checkLengthMap, checkLengthErrorMessages } from './validation';

const fieldMap = ({
  '/signin': [
    'email',
    'password' ],

  '/signup': [ 'email',
    'password',
    'firstName',
    'lastName' ],
});

/**
 * middleware to check for null validations and other bad requests
 * @param {object} req
 *
 * @param {object} res
 *
 * @param {function} next
 *
 * @returns {void|response} res
 */
export default (req, res, next) => {

  const { path } = req;

  const error = {};

  fieldMap[ path ].map((field) => {
    if (req.body[ field ]) {
      checkLengthMap[ field ]
        .every((fn) => !fn(req.body[ field ]) && { error: { [ field ]: checkLengthErrorMessages[ field ] } });
    } else if (!req.body[ field ]) {

      error[ field ] = checkLengthErrorMessages[ field ];
    }
    return true;

  });


  if (!isEmpty(error)) {
    return res.status(400).send({
      status: 'error',
      message: 'An error has occured',
      error,
    });
  }
  next();
};
