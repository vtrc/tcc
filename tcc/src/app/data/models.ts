export type ActionStatus = 'planned' | 'done' | 'skipped' | 'rescheduled';
export type ActionType = 'anti_avoidance' | 'values' | 'exposure' | 'reframe' | 'maintenance';

export interface Action {
  id: string;
  account_id: string;
  user_id: string;
  source_entry_id?: string | null;
  action_type: ActionType;
  title: string;
  details?: string | null;
  scheduled_for?: string | null; // YYYY-MM-DD
  status: ActionStatus;
  completed_at?: string | null;
  created_at: string;
}

export interface Dashboard {
  date: string;
  week_start: string;
  mode: 'flexible' | 'surgical';
  metrics: {
    avoidance_index: number;
    safety_behavior_count: number;
    values_actions_count: number;
    missed_actions_count: number;
    clean_exposures_count: number;
    dominant_pattern: string | null;
  };
  actions_today: Action[];
  actions_overdue: Action[];
  next_exposure: Action | null;
}

export interface EntryCreate {
  account_id: string;
  user_id: string;
  entry_type: 'thought_record';
  occurred_at: string;
  situation?: string | null;
  automatic_thought?: string | null;
  avoidance_target?: string | null;
  approached?: boolean | null;
  probability_before?: number | null;
  distortion_code?: string | null;
  emotion1_code?: string | null;
  emotion1_intensity?: number | null;
  notes?: string | null;
}

export interface ExposureCreate {
  account_id: string;
  user_id: string;
  hierarchy_id?: string | null;
  step_id?: string | null;
  suds_start: number;
  suds_peak: number;
  suds_end: number;
  escaped_early?: boolean | null;
  learning?: string | null;
}