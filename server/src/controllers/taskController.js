const Task = require('../models/Task');
const { taskSchema, updateTaskSchema } = require('../validators/taskValidator');

exports.getTasks = async (req, res, next) => {
  try {
    const {
      status, priority, sortBy = 'createdAt',
      order = 'desc', search, page = 1, limit = 9
    } = req.query;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    // if (search) filter.title = { $regex: search, $options: 'i' };
    if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };

    const sortOrder = order === 'asc' ? 1 : -1;
    const validSortFields = ['dueDate', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      tasks,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = await Task.create({ ...value, user: req.user.id });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      value,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
