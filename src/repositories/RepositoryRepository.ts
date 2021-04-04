import { RepositoryModel } from '../models';

class RepositoryRepository {
  indexActive() {
    return RepositoryModel.find({
      active: true,
    });
  }

  showByName(name: string) {
    return RepositoryModel.findOne({
      name,
    });
  }

  async incrementSearchCountById(id: string) {
    const {
      search_count: searchCount,
    } = await RepositoryModel.findOne({ _id: id });

    return RepositoryModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        search_count: searchCount + 1,
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

  removeAll() {
    return RepositoryModel.deleteMany();
  }
}

export {
  RepositoryRepository,
};
