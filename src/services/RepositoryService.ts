import axios from 'axios';
import { differenceInDays, format } from 'date-fns';
import { StandardDeviationService } from './StandardDeviationService';

import {
  noTratedIssuesInterface, repositoryIssueResponseInterface,
  repositoryIssuesInterface,
} from '../interfaces';
import { RepositoryRepository } from '../repositories';
import { stateIssuesEnum } from '../utils/enums/stateIssues';
import { PagesService } from '.';

const API_GITHUB_BASE_URL = process.env.GITHUB_API_BASE_URL;
const API_GITHUB_TOKEN = process.env.GITHUB_AUTH_TOKEN;

class RepositoryService {
  async searchIssues(repository: repositoryIssuesInterface) {
    const standardDeviationService = new StandardDeviationService();
    const pagesService = new PagesService();

    const { owner, projectName } = repository;
    const perPage: number = 100;
    const openIssues: Array<number> = [];
    let totalTimeOfOpenIssues: number = 0;

    const {
      data: repoResponse,
    } = await this.getRepositoryDetails(owner, projectName);

    if (repoResponse && repoResponse.open_issues) {
      const totalOpenIssues = repoResponse.open_issues;
      const pages = pagesService
        .createPagesArrayFromLimitNumber(Math.round(totalOpenIssues / perPage));

      await Promise.all(
        pages.map(async (item) => {
          const {
            data: issuesResponse,
          } = await this.getIssuesDetails(owner, projectName, item, perPage, stateIssuesEnum.OPEN);

          if (issuesResponse && issuesResponse.length) {
            totalTimeOfOpenIssues += this.issuesTimeOpenCalculate(issuesResponse, openIssues);
          }
        }),
      );

      await this.updateOrCreateDataBaseRegister(owner, projectName);
    }

    const openIssuesAverage = totalTimeOfOpenIssues / openIssues.length;
    const openIssuesDeviation = standardDeviationService
      .calculateStandardDeviation(openIssuesAverage, openIssues);

    const response = {
      repository: projectName,
      open_issues: openIssues.length,
      open_issues_average_age: openIssuesAverage,
      open_issues_std_average: openIssuesDeviation,
    };

    return response;
  }

  async issuesStats() {
    const repositoryRepository = new RepositoryRepository();
    const pagesService = new PagesService();

    const activeRepositories = await repositoryRepository.indexActive();

    const noTratedStats: any = {};
    if (activeRepositories && activeRepositories.length) {
      for (const repository of activeRepositories) {
        const { owner, name: projectName } = repository;
        const perPage: number = 100;

        noTratedStats[projectName] = {};

        const {
          data: repoResponse,
        } = await this.getRepositoryDetails(owner, projectName);

        if (repoResponse && repoResponse.open_issues) {
          const totalOpenIssues = repoResponse.open_issues;
          const pages = pagesService
            .createPagesArrayFromLimitNumber(Math.round(totalOpenIssues / perPage));

          await Promise.all(
            pages.map(async (item) => {
              const {
                data: issuesResponse,
              } = await this.getIssuesDetails(
                owner, projectName, item, perPage, stateIssuesEnum.ALL,
              );

              if (issuesResponse && issuesResponse.length) {
                noTratedStats[projectName] = this.mountNotratedIssues(issuesResponse);
              }
            }),
          );
        }
      }
    }

    const data = {
      repositories: this.createArrayRepositoriesStats(noTratedStats),
    };

    return data;
  }

  // =====> PRIVATE METHODOS <===== //

  private mountNotratedIssues(
    issuesResponse: Array<repositoryIssueResponseInterface>,
  ) {
    const noTratedStats: noTratedIssuesInterface = {
      issues: {},
    };

    for (const issue of issuesResponse) {
      const { state, created_at: createdAt } = issue;
      const date = format(new Date(createdAt), 'yyyy/MM/dd');

      const issueExists = noTratedStats.issues[date];

      if (!issueExists) {
        noTratedStats.issues[date] = {
          open: 0,
          closed: 0,
        };
      }

      noTratedStats.issues[date][state] += 1;
    }

    return noTratedStats;
  }

  private createArrayRepositoriesStats(noTratedStats: noTratedIssuesInterface) {
    const convertedStats = Object.entries(noTratedStats);

    const tratedStats = [];
    for (const [repository, statsValue] of convertedStats) {
      const { issues: noTratedIssues } = statsValue;
      const convertedIssues: Array<any> = Object.entries(noTratedIssues);

      const issues = [];
      for (const [date, issueValue] of convertedIssues) {
        const { open, closed } = issueValue;

        issues.push({
          created_at: date,
          open,
          closed,
        });
      }

      tratedStats.push({
        repository,
        issues,
      });
    }

    return tratedStats;
  }

  private issuesTimeOpenCalculate(
    responseData: Array<repositoryIssueResponseInterface>, openIssues: Array<number>,
  ) {
    let totalTimeOfOpenIssues: number = 0;

    for (const data of responseData) {
      const { created_at: createdAt } = data;
      const difference = this.calculateDifferenceInDays(new Date(createdAt));
      totalTimeOfOpenIssues += difference;
      openIssues.push(difference);
    }

    return totalTimeOfOpenIssues;
  }

  private getIssuesDetails(
    owner: string, projectName: string, page: number,
    perPage: number, state: stateIssuesEnum,
  ) {
    return axios.get(
      `${API_GITHUB_BASE_URL}/repos/${owner}/${projectName}/issues`,
      {
        params: { page, per_page: perPage, state },
        headers: { Authorization: `token ${API_GITHUB_TOKEN}` },
      },
    );
  }

  private getRepositoryDetails(owner: string, projectName: string) {
    return axios.get(
      `${API_GITHUB_BASE_URL}/repos/${owner}/${projectName}`,
      {
        headers: { Authorization: `token ${API_GITHUB_TOKEN}` },
      },
    );
  }

  private async updateOrCreateDataBaseRegister(owner: string, projectName: string) {
    const repositoryRepository = new RepositoryRepository();
    const repositoryExists = await repositoryRepository.showByName(projectName);

    if (repositoryExists) {
      const { _id: id } = repositoryExists;
      await repositoryRepository.incrementSearchCountById(id);
    }
    else {
      await repositoryRepository.create(owner, projectName);
    }
  }

  private calculateDifferenceInDays(compareDate: Date) {
    return differenceInDays(new Date(), compareDate);
  }
}

export {
  RepositoryService,
};
