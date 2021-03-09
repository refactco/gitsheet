/* eslint-disable camelcase */
import { IGitData } from '../../src/git-sheet/git-sheet-interface';
import { GitIssueState, GitMilestoneState, GitUserState } from './git-issue-handler-enum';

export interface IGitUser {
  readonly id: number;
  readonly name: string;
  readonly username: string;
  readonly state: GitUserState;
  readonly avatar_url: string;
  readonly web_url: string;
}

export interface IGitMilestone {
  readonly id: number;
  readonly iid: number;
  readonly group_id: number;
  readonly title: string;
  readonly description: string;
  readonly state: GitMilestoneState;
  readonly created_at: string;
  readonly updated_at: string;
  readonly due_date: string;
  readonly start_date: string;
  readonly expired: boolean;
  readonly web_url: string;
}

export interface IGitIssue {
  readonly id: number;
  readonly iid: number;
  readonly project_id: number;
  readonly title: string;
  readonly description: string;
  readonly state: GitIssueState;
  readonly created_at: string;
  readonly updated_at: string | null;
  readonly closed_at: string | null;
  readonly closed_by: string | null;
  readonly labels: string[];
  readonly milestone: IGitMilestone;
  readonly assignees: IGitUser[];
  readonly author: IGitUser;
  readonly assignee: IGitUser;
  readonly user_notes_count: number;
  readonly merge_requests_count: number;
  readonly upvotes: number;
  readonly downvotes: number;
  readonly due_date: string | null;
  readonly confidential: boolean;
  readonly discussion_locked: string | null;
  readonly web_url: string;
  readonly time_stats: {
    readonly time_estimate: number;
    readonly total_time_spent: number;
    readonly human_time_estimate: string | null;
    readonly human_total_time_spent: string | null;
  };
  readonly task_completion_status: {
    readonly count: number;
    readonly completed_count: number;
  };
  readonly has_tasks: boolean;
  readonly _links: {
    readonly self: string;
    readonly notes: string;
    readonly award_emoji: string;
    readonly project: string;
  };
  readonly references: {
    readonly short: string;
    readonly relative: string;
    readonly full: string;
  };
  readonly moved_to_id: string | null;
  readonly service_desk_reply_to: string | null;
}

export interface IGitIssueStatistic {
  readonly counts: {
    readonly all: number;
    readonly closed: number;
    readonly opened: number;
  };
}

export interface IGitGetIssueParam {
  readonly projectId: string;
  readonly page?: number;
  readonly milestoneTitle?: string;
}

export interface IGitIssueHandlerEntry extends IGitData {}
