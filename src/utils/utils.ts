import mongoose from 'mongoose';

const Utils = {
  async dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      try {
        await collection.drop();
      } catch (error) {
        console.log(error);
      }
    }
  },
};

export default Utils;
