import axios from 'axios';
import { differenceInDays } from 'date-fns';

import { repositoryIssueResponseInterface, repositoryIssuesInterface } from '../interfaces';
import { RepositoryRepository } from '../repositories';

const repositoryRepository = new RepositoryRepository();

const API_GITHUB_BASE_URL = process.env.GITHUB_API_BASE_URL;
const API_GITHUB_TOKEN = process.env.GITHUB_AUTH_TOKEN;

class RepositoryService {
  async searchIssues(repository: repositoryIssuesInterface) {
    let totalAgeOpenIssues: number = 0;
    const { owner, projectName } = repository;
    const perPage: number = 100;
    const openIssues: Array<number> = [];

    await this.updateOrCreateDataBaseRegister(owner, projectName);

    const {
      data: repoResponse,
    } = await this.getRepositoryDetails(owner, projectName);

    if (repoResponse && repoResponse.open_issues) {
      const totalOpenIssues = repoResponse.open_issues;
      const pages = this.createArrayPages(Math.round(totalOpenIssues / perPage));

      await Promise.all(
        pages.map(async (item) => {
          const {
            data: issuesResponse,
          } = await this.getIssuesDetails(owner, projectName, item, perPage);

          if (issuesResponse && issuesResponse.length) {
            totalAgeOpenIssues += this.issuesCalculate(issuesResponse, openIssues);
          }
        }),
      );
    }

    const openIssuesAverage = totalAgeOpenIssues / openIssues.length;
    const openIssuesDeviation = this.standardDeviation(openIssuesAverage, openIssues);

    const response = {
      repository: projectName,
      open_issues: openIssues.length,
      open_issues_average_age: openIssuesAverage,
      open_issues_std_average: openIssuesDeviation,
    };

    return response;
  }

  private createArrayPages(limit: number) {
    const pages = [];
    const tratedLimit = limit || 1;

    for (let i = 1; i <= tratedLimit; i += 1) {
      pages.push(i);
    }

    return pages;
  }

  private issuesCalculate(
    responseData: Array<repositoryIssueResponseInterface>, openIssues: Array<number>,
  ) {
    let totalAgeOpenIssues: number = 0;

    for (let i = 0; i < responseData.length; i += 1) {
      const { created_at: createdAt } = responseData[i];
      const difference = this.calcDifferenceInDays(new Date(createdAt));
      totalAgeOpenIssues += difference;
      openIssues.push(difference);
    }

    return totalAgeOpenIssues;
  }

  private getIssuesDetails(owner: string, projectName: string, page: number, perPage: number) {
    return axios.get(
      `${API_GITHUB_BASE_URL}/repos/${owner}/${projectName}/issues`,
      {
        params: { page, per_page: perPage, state: 'open' },
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
    const repositoryExists = await repositoryRepository.showByName(projectName);

    if (repositoryExists) {
      const { _id: id } = repositoryExists;
      await repositoryRepository.incrementSearchCountById(id);
    }
    else {
      await repositoryRepository.create(owner, projectName);
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
