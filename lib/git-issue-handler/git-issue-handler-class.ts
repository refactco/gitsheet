import { IResponse, Requester, ResponseHandler } from '@rove-team/requester';
import {
  IGitGetIssueParam,
  IGitIssue,
  IGitIssueHandlerEntry,
  IGitIssueStatistic,
} from './git-issue-handler-interface';

export class GitIssueHandler {
  private requester: Requester;

  public constructor(private readonly entry: IGitIssueHandlerEntry) {
    this.requester = new Requester();
  }

  // eslint-disable-next-line class-methods-use-this
  private checkMilestone(param: { milestoneTitle?: string }): string {
    const { milestoneTitle } = param;
    const milestone: string = milestoneTitle
      ? `&milestone=${encodeURIComponent(milestoneTitle)}`
      : '';

    return milestone;
  }

  public async getIssuesStatistics(param: IGitGetIssueParam): Promise<IGitIssueStatistic> {
    const { projectId } = param;
    const { gitBaseURL, gitAccessToken } = this.entry;
    const url: string = `${gitBaseURL}/${projectId}/issues_statistics`;

    const response: IResponse = await this.requester.get({
      url,
      options: {
        headers: {
          'PRIVATE-TOKEN': gitAccessToken,
        },
      },
    });

    const responseHandler: ResponseHandler = new ResponseHandler({ response });
    const responseBody: any = responseHandler.getBody<any>();

    return responseBody.statistics;
  }

  public async getIssues(param: IGitGetIssueParam): Promise<IGitIssue[]> {
    const { projectId, page = 1, milestoneTitle } = param;
    const { gitBaseURL, gitAccessToken } = this.entry;
    const milestone: string = this.checkMilestone({ milestoneTitle });
    const url: string = `${gitBaseURL}/${projectId}/issues?per_page=100&page=${page}&confidential=false${milestone}`;

    const response: IResponse = await this.requester.get({
      url,
      options: {
        headers: {
          'PRIVATE-TOKEN': gitAccessToken,
        },
      },
    });

    const responseHandler: ResponseHandler = new ResponseHandler({ response });
    const responseBody: IGitIssue[] = responseHandler.getBody<IGitIssue[]>();

    return responseBody;
  }
}
