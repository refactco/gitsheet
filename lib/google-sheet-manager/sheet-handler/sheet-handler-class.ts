import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import {
  ISheetHandlerAddMultipleRowsParam,
  ISheetHandlerEntry,
  ISheetHandlerGetRowsParam,
  ISheetHandlerSetHeaderRowsParam,
  ISheetRow,
} from './sheet-handler-interface';
import { TSheetRow } from './sheet-handler-type';

export class SheetHandler<T extends ISheetRow> {
  public constructor(private readonly entry: ISheetHandlerEntry) {}

  public async getRows(param: ISheetHandlerGetRowsParam<T>): Promise<T[]> {
    const { sheet } = this.entry;
    const { options, where } = param;
    let rows: GoogleSpreadsheetRow[] = await sheet.getRows(options);

    if (where) {
      rows = rows.filter((value: GoogleSpreadsheetRow, index: number): boolean => {
        const result: boolean = where({
          value: value as T,
          index,
        });

        return result;
      });
    }

    return (rows as unknown) as T[];
  }

  public async addRow(param: TSheetRow<T>): Promise<void> {
    const { sheet } = this.entry;

    await sheet.addRow(param as any);
  }

  public async addMultipleRows(param: ISheetHandlerAddMultipleRowsParam<T>): Promise<void> {
    const { sheet } = this.entry;
    const { rows } = param;

    await sheet.addRows(rows as any[]);
  }

  public async clear(): Promise<void> {
    const { sheet } = this.entry;

    await sheet.clear();
  }

  public async setHeaderRows(param: ISheetHandlerSetHeaderRowsParam): Promise<void> {
    const { sheet } = this.entry;
    const { headerRows } = param;

    await sheet.setHeaderRow(headerRows);
  }
}
