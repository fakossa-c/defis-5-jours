export type ProspectParams = {
  company: string | null;
  role: string | null;
  sector: string | null;
  color: string;
  contact: string | null;
  source: string | null;
};

export type BriefData = {
  company: string;
  contact: string;
  sector: string;
  problem: string;
  users: string;
  current_solution: string;
  desired_outcome: string;
  five_day_scope: string;
  suggested_deliverable: string;
  notes: string;
};

export type BriefMetadata = {
  company: string;
  contact: string;
  sector: string;
  source: string;
  timestamp: string;
};

export type AppState = 'landing' | 'chat' | 'recap';

export type ApiError = {
  error: string;
  code: string;
  retryable: boolean;
};
