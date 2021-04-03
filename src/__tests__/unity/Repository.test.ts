import { StandardDeviationService } from '../../services';

const standardDeviationService = new StandardDeviationService();

describe('StandardDeviation', () => {
  test('Should be able calculate standard desviation', async () => {
    const heightArray = [1.55, 1.70, 1.80];
    const average = 1.68;
    const deviationResult = standardDeviationService
      .calculateStandardDeviation(average, heightArray);

    expect(deviationResult).toBe(0.1028);
  });
});
