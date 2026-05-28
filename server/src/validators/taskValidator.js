const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).allow('').optional(),
  dueDate: Joi.date().required(),
  priority: Joi.string().valid('Low', 'Medium', 'High').required(),
  status: Joi.string().valid('To-Do', 'In Progress', 'Done').optional(),
  order: Joi.number().optional()
});

const updateTaskSchema = taskSchema.fork(
  ['title', 'dueDate', 'priority'],
  (field) => field.optional()
);

module.exports = { taskSchema, updateTaskSchema };
