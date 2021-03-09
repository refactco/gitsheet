import { ISheetRow } from '../../lib/google-sheet-manager/sheet-handler/sheet-handler-interface';
import { IGoogleClientData } from '../git-sheet/git-sheet-interface';
import { ProjectShowMilestone } from './project-finder-enum';

export interface IProjectFinderEntry extends IGoogleClientData {
  readonly sheetId: string;
}

export interface IProjectInformation extends ISheetRow {
  readonly 'Project Title': string;
  readonly 'Project ID': string;
  readonly 'Sheet ID': string;
  readonly 'Maximum Closed Show Days': number;
  readonly 'Milestone Title': string;
  readonly 'Show Milestone': ProjectShowMilestone;
}
