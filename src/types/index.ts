export type EntityType = 'okr' | 'initiative' | 'epic' | 'story' | 'task' | 'doc';

export type Status = 'draft' | 'active' | 'in_progress' | 'done' | 'cancelled';

export type InitiativeType = 'engineering' | 'marketing' | 'sales' | 'operations' | 'other';

export interface Link {
  id: string;
  fromId: string;
  fromType: EntityType;
  toId: string;
  toType: EntityType;
  relation: string; // e.g. "contributes_to", "part_of", "blocks", "related", "documents"
}

export interface OKR {
  id: string;
  objective: string;
  keyResults: KeyResult[];
  period: string; // e.g. "Q1 2026"
  status: Status;
  createdAt: string;
}

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  type: InitiativeType;
  status: Status;
  owner: string;
  createdAt: string;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  status: Status;
  points?: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  assignee?: string;
  createdAt: string;
}

export interface Doc {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
