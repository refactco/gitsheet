/* eslint-disable import/no-extraneous-dependencies */
import { config } from 'dotenv';
import { GitSheet } from '../src/git-sheet/git-sheet-class';

config();
const {
  GIT_BASE_URL = '',
  GIT_ACCESS_TOKEN = '',
  GOOGLE_CLIENT_EMAIL = '',
  GOOGLE_PRIVATE_KEY = '',
  PROJECTS_SHEET_ID = '',
  CRON_JOB_TIME = '',
} = process.env;
const gitSheet: GitSheet = new GitSheet({
  gitBaseURL: GIT_BASE_URL,
  gitAccessToken: GIT_ACCESS_TOKEN,
  googleClientEmail: GOOGLE_CLIENT_EMAIL,
  googlePrivateKey: GOOGLE_PRIVATE_KEY,
});

gitSheet.start({
  projectInformationSheetID: PROJECTS_SHEET_ID,
  cronJonTime: CRON_JOB_TIME,
});
