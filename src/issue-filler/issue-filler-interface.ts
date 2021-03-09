import { GitIssueState } from '../../lib/git-issue-handler/git-issue-handler-enum';
import { ISheetRow } from '../../lib/google-sheet-manager/sheet-handler/sheet-handler-interface';
import { IGitData, IGoogleClientData } from '../git-sheet/git-sheet-interface';
import { IProjectInformation } from '../project-finder/project-finder-interface';

export interface IIssueFillerEntry extends IGoogleClientData, IGitData {
  readonly projectInformation: IProjectInformation;
}

export interface IIssueInformation extends ISheetRow {
  readonly 'Issue Title': string;
  readonly 'Created Date': string;
  readonly 'Status': string;
  readonly 'Due Date': string;
  readonly 'Milestone'?: string;
}

export interface IIssueFillerGetIssuesParam {
  readonly page?: number;
}

export interface IIssueFillerGetTotalIssuesParam {
  readonly totalIssues: number;
}

export interface IIssueFillerParseDateParam {
  readonly date: string;
}

export interface IIssueFillerParsStatusParam {
  readonly state: GitIssueState;
  readonly labels: string[];
}

export interface IIssueFillerCheckCloseTimeParam {
  readonly state: GitIssueState;
  readonly closedAt: string;
}
