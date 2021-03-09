import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { TSheetRow } from './sheet-handler-type';

export interface ISheetHandlerEntry {
  readonly sheet: GoogleSpreadsheetWorksheet;
}

export interface ISheetRow {
  readonly a1Range: string;
  readonly rowIndex: number;
  save(): Promise<void>;
  delete(): Promise<void>;
}

export interface ISheetHandlerGetRowsOption {
  readonly limit: number;
  readonly offset: number;
}

export interface ISheetHandlerGetRowsWhereParam<T extends ISheetRow> {
  readonly value: T;
  readonly index: number;
}

export interface ISheetHandlerGetRowsParam<T extends ISheetRow> {
  readonly options?: ISheetHandlerGetRowsOption;
  where?(param: ISheetHandlerGetRowsWhereParam<T>): boolean;
}

export interface ISheetHandlerDeleteRowParam {
  readonly rowIndex: number;
}

export interface ISheetHandlerAddMultipleRowsParam<T extends ISheetRow> {
  readonly rows: TSheetRow<T>[];
}

export interface ISheetHandlerSetHeaderRowsParam {
  readonly headerRows: string[];
}
