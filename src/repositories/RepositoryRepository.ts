import { RepositoryModel } from '../models';

class RepositoryRepository {
  showByName(name: string) {
    return RepositoryModel.findOne({
      name,
    });
  }

  incrementSearchCountById(id: string) {
    return RepositoryModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $inc: { search_count: 1 },
      },
    );
  }

  create(owner: string, name: string) {
    return RepositoryModel.create(
      {
        owner,
        name,
        active: true,
        search_count: 1,
      },
    );
  }
}

export {
  RepositoryRepository,
};
