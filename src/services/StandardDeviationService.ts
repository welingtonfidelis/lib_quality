class StandardDeviationService {
  calculateStandardDeviation(average: number, allValues: Array<number>) {
    let deviation = 0;
    for (const value of allValues) {
      const v = value - average;
      deviation += v * v;
    }

    return parseFloat((Math.sqrt(deviation / allValues.length)).toFixed(4));
  }
}

export {
  StandardDeviationService,
};
