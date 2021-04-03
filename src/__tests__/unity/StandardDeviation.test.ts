import { StandardDeviationService } from '../../services';

describe('Unity tests: StandardDeviation', () => {
  test('Should be able calculate standard desviation', () => {
    const standardDeviationService = new StandardDeviationService();
    const heightArray = [1.55, 1.70, 1.80];
    const average = 1.68;
    const deviationResult = standardDeviationService
      .calculateStandardDeviation(average, heightArray);

    expect(deviationResult).toBe(0.1028);
  });
});
