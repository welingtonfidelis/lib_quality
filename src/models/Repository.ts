import mongoose from 'mongoose';

const Repository = new mongoose.Schema(
  {
    owner: String,
    name: String,
    search_count: Number,
    active: Boolean,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const RepositoryModel = mongoose.model('Repository', Repository);

export {
  RepositoryModel,
};
