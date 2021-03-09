/* eslint-disable camelcase */
import moment, { Moment } from 'moment';
import { GitIssueHandler } from '../../lib/git-issue-handler/git-issue-handler-class';
import { GitIssueState } from '../../lib/git-issue-handler/git-issue-handler-enum';
import {
  IGitIssue,
  IGitIssueStatistic,
} from '../../lib/git-issue-handler/git-issue-handler-interface';
import { GoogleSheetManager } from '../../lib/google-sheet-manager/google-sheet-manager-class';
import { SheetHandler } from '../../lib/google-sheet-manager/sheet-handler/sheet-handler-class';
import { TSheetRow } from '../../lib/google-sheet-manager/sheet-handler/sheet-handler-type';
import { ProjectShowMilestone } from '../project-finder/project-finder-enum';
import {
  IIssueFillerCheckCloseTimeParam,
  IIssueFillerEntry,
  IIssueFillerGetIssuesParam,
  IIssueFillerGetTotalIssuesParam,
  IIssueFillerParseDateParam,
  IIssueFillerParsStatusParam,
  IIssueInformation,
} from './issue-filler-interface';

export class IssueFiller {
  private googleSheetManager: GoogleSheetManager;

  private gitIssueHandler: GitIssueHandler;

  private validLabels: string[] = ['QA', 'To Do', 'Doing', 'Waiting'];

  public constructor(private readonly entry: IIssueFillerEntry) {
    const {
      projectInformation,
      googleClientEmail,
      googlePrivateKey,
      gitBaseURL,
      gitAccessToken,
    } = entry;
    const { 'Sheet ID': sheetId } = projectInformation;

    this.googleSheetManager = new GoogleSheetManager({
      sheetId,
      googleClientEmail,
      googlePrivateKey,
    });

    this.gitIssueHandler = new GitIssueHandler({
      gitBaseURL,
      gitAccessToken,
    });
  }

  private async getIssuesStatistics(): Promise<IGitIssueStatistic> {
    const { entry, gitIssueHandler } = this;
    const { 'Project ID': projectId } = entry.projectInformation;

    return gitIssueHandler.getIssuesStatistics({ projectId });
  }

  private async getIssues(param: IIssueFillerGetIssuesParam): Promise<IGitIssue[]> {
    const { entry, gitIssueHandler } = this;
    const { page } = param;
    const { 'Project ID': projectId, 'Milestone Title': milestoneTitle } = entry.projectInformation;

    return gitIssueHandler.getIssues({ projectId, page, milestoneTitle });
  }

  private async getTotalIssues(param: IIssueFillerGetTotalIssuesParam): Promise<IGitIssue[]> {
    const { totalIssues } = param;
    const loopLength: number = Math.floor(totalIssues / 100 + 1);
    let issues: IGitIssue[] = [];

    for (let i = 1; i <= loopLength; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      issues = [...issues, ...(await this.getIssues({ page: i }))];
    }

    return issues;
  }

  // eslint-disable-next-line class-methods-use-this
  private parseDate(param: IIssueFillerParseDateParam): string {
    const { date } = param;
    const DATE_FORMAT: string = 'M/D/YYYY';
    const parsedDate: string = moment(date).format(DATE_FORMAT);

    return parsedDate;
  }

  private parseStatus(param: IIssueFillerParsStatusParam): string {
    const { labels, state } = param;
    const CLOSED: string = 'Closed';
    const OPENED: string = 'Opened';
    const showLabels: string[] = labels.filter((label: string): boolean => {
      const isInclude: boolean = this.validLabels.includes(label);

      return isInclude;
    });
    const isShowLabel: boolean = showLabels.length > 0 && state !== GitIssueState.CLOSED;
    const showLabel: string = isShowLabel ? showLabels.join(' - ') : '';
    const openStatus: string = showLabels.length > 0 ? showLabel : OPENED;

    const showStatus: string = state === GitIssueState.CLOSED ? CLOSED : openStatus;

    return showStatus;
  }

  // eslint-disable-next-line class-methods-use-this
  private checkCloseTime(param: IIssueFillerCheckCloseTimeParam): boolean {
    const { state, closedAt } = param;
    const { 'Maximum Closed Show Days': maximumClosedShowDays = 7 } = this.entry.projectInformation;

    if (state === GitIssueState.OPENED) {
      return true;
    }

    const now: Moment = moment();
    const closedTime: Moment = moment(closedAt);
    const differenceTime: number = now.diff(closedTime, 'days');

    return differenceTime <= maximumClosedShowDays;
  }

  public async fill(): Promise<void> {
    const {
      'Show Milestone': showMilestone,
      'Project ID': projectID,
    } = this.entry.projectInformation;
    const sheet: any = await this.googleSheetManager.loadSheet({});
    const sheetHandler: SheetHandler<IIssueInformation> = new SheetHandler<IIssueInformation>({
      sheet,
    });
    const parsedIssues: TSheetRow<IIssueInformation>[] = [];

    const { counts } = await this.getIssuesStatistics();
    const issues: IGitIssue[] = await this.getTotalIssues({ totalIssues: counts.all });

    if (issues.length <= 0) {
      await sheetHandler.clear();
      await sheetHandler.setHeaderRows({
        headerRows: ['Issue Title', 'Created Date', 'Status', 'Due Date'],
      });

      throw new Error(`There is no issue for project #${projectID} with provided information`);
    }

    issues.map(
      (issue: IGitIssue): TSheetRow<IIssueInformation> => {
        const { title, created_at, closed_at, state, due_date, labels, milestone } = issue;
        const isCloseTimeAppropriate: boolean = this.checkCloseTime({
          state,
          closedAt: closed_at ?? '',
        });

        if (isCloseTimeAppropriate) {
          const notAvailable: string = 'N/A';
          const showStatus: string = this.parseStatus({ state, labels });

          const parsedIssue: TSheetRow<IIssueInformation> = {
            'Issue Title': title,
            'Created Date': this.parseDate({ date: created_at }),
            'Status': showStatus,
            'Due Date': due_date ? this.parseDate({ date: due_date }) : '',
            'Milestone': milestone ? milestone.title : notAvailable,
          };

          parsedIssues.push(parsedIssue);
        }

        return {} as IIssueInformation;
      },
    );

    const [firstParsedIssue] = parsedIssues;
    let headerRows: string[] = Object.keys(firstParsedIssue);

    if (showMilestone === ProjectShowMilestone.FALSE) {
      const MILESTONE_KEY = 'Milestone';

      headerRows = headerRows.filter((value: string) => value !== MILESTONE_KEY);
    }

    await sheetHandler.clear();
    await sheetHandler.setHeaderRows({ headerRows });
    await sheetHandler.addMultipleRows({ rows: parsedIssues });
  }
}
