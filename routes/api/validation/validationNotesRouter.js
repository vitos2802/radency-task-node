const Joi = require('joi')

const schemaCreatNote = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  content: Joi.string().required(),
  category: Joi.string().required(),
})

const schemaUpdateNote = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  content: Joi.string().optional(),
  category: Joi.string().optional(),
}).or('name', 'content', 'category')

const validation = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj)
    return next()
  } catch (error) {
    next({ status: 400, message: error.message })
  }
}

const schemaUpdateIsArchiveNote = Joi.object({
  archived: Joi.boolean().required(),
})

const validationCreatNote = async (req, res, next) => {
  return await validation(schemaCreatNote, req.body, next)
}

const validationUpdateNote = async (req, res, next) => {
  return await validation(schemaUpdateNote, req.body, next)
}

const validationUpdateIsArchiveNote = async (req, res, next) => {
  return await validation(schemaUpdateIsArchiveNote, req.body, next)
}

module.exports = {
  validationCreatNote,
  validationUpdateNote,
  validationUpdateIsArchiveNote,
}
