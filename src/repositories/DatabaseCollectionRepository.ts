import mongoose from 'mongoose';

class DatabaseCollectionRepository {
  async dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);

    if (collections && collections.length) {
      for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];

        try {
          await collection.drop();
        } catch (error) {
          console.log('Drop Collection Failed', error);
        }
      }
    }
  }
}

export {
  DatabaseCollectionRepository,
};
