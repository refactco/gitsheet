import { GoogleSheetManager } from '../../lib/google-sheet-manager/google-sheet-manager-class';
import { SheetHandler } from '../../lib/google-sheet-manager/sheet-handler/sheet-handler-class';
import { IProjectFinderEntry, IProjectInformation } from './project-finder-interface';

export class ProjectFinder {
  private projects: IProjectInformation[];

  public constructor(private readonly entry: IProjectFinderEntry) {}

  private async getProjectSheet(): Promise<void> {
    const { sheetId, googleClientEmail, googlePrivateKey } = this.entry;
    const googleSheetManager: GoogleSheetManager = new GoogleSheetManager({
      sheetId,
      googleClientEmail,
      googlePrivateKey,
    });

    const sheet = await googleSheetManager.loadSheet({});
    const sheetHandler: SheetHandler<IProjectInformation> = new SheetHandler({
      sheet,
    });
    this.projects = await sheetHandler.getRows({});
  }

  public async getAll(): Promise<IProjectInformation[]> {
    await this.getProjectSheet();

    return this.projects;
  }
}
