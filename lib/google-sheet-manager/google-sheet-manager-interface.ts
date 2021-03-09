import { IGoogleClientData } from '../../src/git-sheet/git-sheet-interface';

export interface ILoadSheetParam {
  readonly sheetIndex?: number;
}

export interface IGoogleSheetManagerEntry extends IGoogleClientData {
  readonly sheetId: string;
}
