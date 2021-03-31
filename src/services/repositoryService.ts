import axios from 'axios';
import { differenceInDays } from 'date-fns';
import { repositoryIssuesInterface } from '../interfaces';
import { RepositoryModel } from '../models';

class RepositoryService {
  API_GITHUB_BASE_URL: string;

  API_GITHUB_TOKEN: string;

  constructor() {
    this.API_GITHUB_BASE_URL = process.env.GITHUB_API_BASE_URL;
    this.API_GITHUB_TOKEN = process.env.GITHUB_AUTH_TOKEN;
  }

  async searchIssues(repository: repositoryIssuesInterface) {
    const runSearch = true;
    const openIssuesTotalAge = 0;
    const closedIssuesTotalAge = 0;
    const perPage = 100;
    const openIssues: Array<number> = [];
    const closedIssues: Array<number> = [];

    await this.updateOrCreateDataBaseRegister(repository.projectName);

    while (runSearch) {
      const page = [1, 2, 3];

      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
      // eslint-disable-next-line no-loop-func
        page.map(async (item) => {
          const { data } = await axios.get(
            `${this.API_GITHUB_BASE_URL}/repos/welington/webChatFront/issues`,
            {
              params: { page: item, per_page: perPage, state: 'all' },
              headers: { Authorization: `token ${this.API_GITHUB_TOKEN}` },
            },
          );

          if (!data || !data.length) {
            runSearch = false;
          }
          else {
            for (let i = 0; i < data.length; i += 1) {
              const { state, created_at: createdAt } = data[i];

              switch (state) {
                case 'open': {
                  openIssuesTotalAge += this.calcDifferenceInDays(new Date(createdAt));
                  openIssues.push(openIssuesTotalAge);
                  break;
                }

                case 'closed': {
                  closedIssuesTotalAge += this.calcDifferenceInDays(new Date(createdAt));
                  closedIssues.push(closedIssuesTotalAge);
                  break;
                }

                default: {
                  break;
                }
              }
            }
          }
        }),

      );
    }

    const openIssuesAverage = openIssuesTotalAge / openIssues.length;
    const closedIssuesAverage = closedIssuesTotalAge / closedIssues.length;
    const openIssuesDeviation = this.standardDeviation(openIssuesAverage, openIssues);
    const closedIssuesDeviation = this.standardDeviation(closedIssuesAverage, closedIssues);

    const response = {
      repository: repository.projectName,
      open_issues: openIssues.length,
      closed_issues: closedIssues.length,
      open_issues_average_age: openIssuesAverage,
      closed_issues_average_age: closedIssuesAverage,
      open_issues_std_average: openIssuesDeviation,
      closed_issues_std_average: closedIssuesDeviation,
    };

    return response;
  }

  async private updateOrCreateDataBaseRegister(projectName: string) {
    const repositoryExists = await RepositoryModel.findOne({
      name: projectName,
    });

    if (!repositoryExists) {
      await RepositoryModel.create(
        {
          name: projectName,
          active: true,
          search_count: 1,
        },
      );
    }
    else {
      await RepositoryModel.findOneAndUpdate(
        {
          _id: repositoryExists._id,
        },
        {
          $inc: { search_count: 1 },
        },
      );
    }
  }

  private standardDeviation(average: number, allValues: Array<number>) {
    let deviation = 0;
    for (let i = 0; i < allValues.length; i += 1) {
      const v = allValues[i] - average;
      deviation += v * v;
    }

    return Math.sqrt(deviation / allValues.length);
  }

  private calcDifferenceInDays(compareDate: Date) {
    return differenceInDays(new Date(), compareDate);
  }
}

export {
  RepositoryService,
};
