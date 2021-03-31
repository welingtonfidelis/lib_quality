import Joi from 'joi';

const validate = Joi.object({
  project_name: Joi.string().required(),
});

export default validate;
