import mongoose from 'mongoose';

const validateObjectId = (err, req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
};

export default validateObjectId;
