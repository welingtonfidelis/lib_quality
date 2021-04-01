import Joi from 'joi';

const validate = Joi.object({
  owner: Joi.string().required(),
  project_name: Joi.string().required(),
});

export default validate;
