# Git Sheet

## Introduction

Gitsheet is a package to bring your git issues into a google spreadsheet. To take a quick looking at your issues' status or share it with your customer(s).

## Installation
To install it as an NPM package, you should use the following command:

```bash
npm i @rove-team/gitsheet
```

## How to create private key and client email
Before using this package, you need to create a `google-client-email` and a `google-private-key`. Use the following steps to make these two:

1. Go to [Google Cloud](https://console.cloud.google.com/cloud-resource-manager)
2. Click on`Create Project` to create a new project or use an already created one.
3. Then from the left-side panel, click on `APIs & Services > Credentials`.
4. Next to the **Google Cloud Platform** text at the header navigation, make sure you are in the right project.
5. Click on `Create Credentials` and choose `Service account`. Then fill out the form and click on the `Create` button.
7. Click on `Done` and that's it. Your client-email is created.
8. Now in the `APIs & Services > Credentials` page, in the **Service Accounts** part, you can see your created **client-email**. Click on it.
9. On the opened page, click on `Add Key > Create new key` and choose the JSON format.
10. In the created JSON file, you can see your **client-email** and **private-key**.
12. Don't forget to share your required spreadsheet documents with this created **client-email**.
13. Also, you should [Enable Google Sheet API ](https://console.cloud.google.com/apis/library/sheets.googleapis.com) for your google cloud account.

## How to create GIT access token
Creating access tokens could be different in each GIT application. So you can see the following link to know how to make an access token for each one:

- [Github](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
- [Gitlab](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
- [Bitbucket](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html)

## Create project information sheet
The next step is creating a new google spreadsheet for your project information. Also, you have to share it with your previously created google **client-email**.

The following headers with the same spell are required for your spreadsheet:

- Project Title
  This column is for your project title, which could be anything meaningful for yourself. This name does not have any impact on your results. 
- Project ID
  In this column, you should write the project ID of your git repository.
- Sheet ID
  For each project, you should create a google spreadsheet and share it with your client email. Then put its ID in this column.
- Maximum Closed Show Days
  The number in this column is the maximum number of days that an issue had been closed. So the issues being closed for more days than this number would not be in the results.
- Show Milestone
  In this column, you should add a simple checkbox. Checking this checkbox will show the milestone column in the spreadsheet of this project.
- Milestone Title
  If you want to get the issues of a specific milestone, you need to write its name in this column. Empty column means showing all issues ( with or without milestone ). `Any` means showing all issues with any milestone. `None` means showing all issues without any milestone.

## How to use
Now you can use this package easily. Just see the following example:
```ts
const gitSheet: GitSheet = new GitSheet({
  gitBaseURL: 'your basic GIT URL based on you git application',
  gitAccessToken: 'your personal git access token',
  googleClientEmail: 'your google client email',
  googlePrivateKey: 'your google private key',
});

gitSheet.start({
  projectInformationSheetID: 'your project information spreadsheet ID',
  cronJonTime: 'the cron format time', // the process will be repeat based on this time
});
```