import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { IGoogleSheetManagerEntry, ILoadSheetParam } from './google-sheet-manager-interface';

export class GoogleSheetManager {
  private sheetSpread: GoogleSpreadsheet;

  public constructor(private readonly entry: IGoogleSheetManagerEntry) {
    const { sheetId } = entry;

    this.sheetSpread = new GoogleSpreadsheet(sheetId);
    this.authenticate();
  }

  private async authenticate(): Promise<void> {
    const { googleClientEmail, googlePrivateKey } = this.entry;

    await this.sheetSpread.useServiceAccountAuth({
      client_email: googleClientEmail,
      private_key: googlePrivateKey,
    });
  }

  public async loadSheet(param: ILoadSheetParam): Promise<GoogleSpreadsheetWorksheet> {
    await this.sheetSpread.loadInfo();

    const { sheetIndex = 0 } = param;
    const { [sheetIndex]: sheet } = this.sheetSpread.sheetsByIndex;

    return sheet;
  }
}
