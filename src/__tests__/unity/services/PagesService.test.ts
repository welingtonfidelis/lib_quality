/* eslint-disable no-undef */
import { PagesService } from '../../../services';

describe('Unity tests: PagesService', () => {
  test('Should be able to create array of numbers from limit number', () => {
    const pagesService = new PagesService();
    const limit = 3;
    const pagesArray = pagesService.createPagesArrayFromLimitNumber(limit);

    expect(pagesArray.length).toBe(3);
    expect(pagesArray).toEqual([1, 2, 3]);
  });
});
