import { scheduleJob } from 'node-schedule';
import { IssueFiller } from '../issue-filler/issue-filler-class';
import { ProjectFinder } from '../project-finder/project-finder-class';
import { IProjectInformation } from '../project-finder/project-finder-interface';
import {
  IGitSheetEntry,
  IGitSheetFillProjectIssuesParam,
  IGitSheetGetProjectParam,
  IGitSheetStartParam,
} from './git-sheet-interface';

export class GitSheet {
  public constructor(private readonly entry: IGitSheetEntry) {}

  private async fillProjectIssues(param: IGitSheetFillProjectIssuesParam): Promise<void> {
    const { projectInformation } = param;
    const { googleClientEmail, googlePrivateKey, gitBaseURL, gitAccessToken } = this.entry;
    const issueFiller: IssueFiller = new IssueFiller({
      projectInformation,
      googleClientEmail,
      googlePrivateKey,
      gitBaseURL,
      gitAccessToken,
    });

    await issueFiller.fill();
  }

  private async getProjectSheet(param: IGitSheetGetProjectParam): Promise<void> {
    const { projectInformationSheetID } = param;
    const { googleClientEmail, googlePrivateKey } = this.entry;
    const projectFinder: ProjectFinder = new ProjectFinder({
      sheetId: projectInformationSheetID,
      googleClientEmail,
      googlePrivateKey,
    });
    const { log, error } = console;

    try {
      const projects: IProjectInformation[] = await projectFinder.getAll();

      if (projects.length > 0) {
        projects.map(
          async (projectInformation: IProjectInformation): Promise<any> => {
            const {
              'Project Title': projectTitle,
              'Project ID': projectId,
              'Sheet ID': sheetId,
            } = projectInformation;
            const isEmpty: boolean = projectId === '' || sheetId === '';

            try {
              if (isEmpty) {
                throw new Error(
                  `The 'projectId' or 'sheetId' are not provided for "${projectTitle}" project`,
                );
              }
              await this.fillProjectIssues({ projectInformation });

              log(`The sheets of project with id:${projectId} are successfully updated`);

              return;
            } catch (e: any) {
              error(e.message);
            }
          },
        );
      } else {
        throw new Error('There is no project in project information sheet');
      }
    } catch (e: any) {
      error(e.message);
    }
  }

  public start(param: IGitSheetStartParam): void {
    const { cronJonTime, projectInformationSheetID } = param;

    scheduleJob(cronJonTime, (): void => {
      this.getProjectSheet({
        projectInformationSheetID,
      });
    });
  }
}
