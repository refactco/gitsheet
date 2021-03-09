import { IProjectInformation } from '../project-finder/project-finder-interface';

export interface IGoogleClientData {
  readonly googleClientEmail: string;
  readonly googlePrivateKey: string;
}

export interface IGitData {
  readonly gitBaseURL: string;
  readonly gitAccessToken: string;
}

export interface IGitSheetEntry extends IGoogleClientData, IGitData {}

export interface IGitSheetStartParam {
  readonly cronJonTime: string;
  readonly projectInformationSheetID: string;
}

export interface IGitSheetGetProjectParam {
  readonly projectInformationSheetID: string;
}

export interface IGitSheetFillProjectIssuesParam {
  projectInformation: IProjectInformation;
}
