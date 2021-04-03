/* eslint-disable no-undef */
import mongoose from 'mongoose';

import databaseConnection from '../../../database/connection';
import { RepositoryRepository } from '../../../repositories';

const repositoryRepository = new RepositoryRepository();

describe('Unity tests: DropAllDatabaseCollections', () => {
  beforeAll(async () => {
    await databaseConnection();

    await repositoryRepository.removeAll();
  });

  afterAll(async () => {
    await repositoryRepository.removeAll();

    await mongoose.connection.close();
  });

  test('Should be able create and list repositories', async () => {
    await repositoryRepository.create('test1', 'teste1');
    await repositoryRepository.create('test2', 'teste2');
    await repositoryRepository.create('test3', 'teste3');

    const repositories = await repositoryRepository.indexActive();

    expect(repositories.length).toBe(3);
  });

  test('Should be able find one repository by name', async () => {
    await repositoryRepository.create('testsearch', 'testsearch');

    const repository = await repositoryRepository.showByName('testsearch');

    expect(repository).toHaveProperty('_id');
  });

  test('Should be able increment search_count in repository', async () => {
    await repositoryRepository.create('testincrement', 'testincrement');

    const repositoryBeforeIncrement = await repositoryRepository.showByName('testincrement');
    const { _id: id, search_count: countBefore } = repositoryBeforeIncrement;

    await repositoryRepository.incrementSearchCountById(id);

    const repositoryAfterIncrement = await repositoryRepository.showByName('testincrement');
    const { search_count: countAfter } = repositoryAfterIncrement;

    expect(countAfter).toBe(countBefore + 1);
  });

  test('Should be able delete all repositories', async () => {
    await repositoryRepository.create('test4', 'teste4');
    await repositoryRepository.create('test5', 'teste5');
    await repositoryRepository.create('test6', 'teste6');

    await repositoryRepository.removeAll();

    const repositories = await repositoryRepository.indexActive();

    expect(repositories.length).toBe(0);
  });
});
