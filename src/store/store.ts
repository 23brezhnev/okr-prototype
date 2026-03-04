import { v4 as uuid } from 'uuid';
import type { OKR, Initiative, Epic, Story, Task, Doc, Link, EntityType } from '../types';

const STORAGE_KEY = 'okr-prototype-data';

export interface AppState {
  okrs: OKR[];
  initiatives: Initiative[];
  epics: Epic[];
  stories: Story[];
  tasks: Task[];
  docs: Doc[];
  links: Link[];
}

function defaultState(): AppState {
  return { okrs: [], initiatives: [], epics: [], stories: [], tasks: [], docs: [], links: [] };
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return defaultState();
}

function save(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = load();
let listeners: Array<() => void> = [];

function notify() {
  save(state);
  listeners.forEach(fn => fn());
}

export const store = {
  getState: () => state,
  subscribe: (fn: () => void) => {
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  },

  // --- Links (decentralized) ---
  addLink: (fromId: string, fromType: EntityType, toId: string, toType: EntityType, relation: string) => {
    const link: Link = { id: uuid(), fromId, fromType, toId, toType, relation };
    state = { ...state, links: [...state.links, link] };
    notify();
    return link;
  },
  removeLink: (id: string) => {
    state = { ...state, links: state.links.filter(l => l.id !== id) };
    notify();
  },
  getLinksFor: (entityId: string): Link[] => {
    return state.links.filter(l => l.fromId === entityId || l.toId === entityId);
  },

  // --- OKRs ---
  addOKR: (data: Omit<OKR, 'id' | 'createdAt'>) => {
    const okr: OKR = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    state = { ...state, okrs: [...state.okrs, okr] };
    notify();
    return okr;
  },
  updateOKR: (id: string, patch: Partial<OKR>) => {
    state = { ...state, okrs: state.okrs.map(o => o.id === id ? { ...o, ...patch } : o) };
    notify();
  },
  deleteOKR: (id: string) => {
    state = { ...state, okrs: state.okrs.filter(o => o.id !== id), links: state.links.filter(l => l.fromId !== id && l.toId !== id) };
    notify();
  },

  // --- Initiatives ---
  addInitiative: (data: Omit<Initiative, 'id' | 'createdAt'>) => {
    const item: Initiative = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    state = { ...state, initiatives: [...state.initiatives, item] };
    notify();
    return item;
  },
  updateInitiative: (id: string, patch: Partial<Initiative>) => {
    state = { ...state, initiatives: state.initiatives.map(i => i.id === id ? { ...i, ...patch } : i) };
    notify();
  },
  deleteInitiative: (id: string) => {
    state = { ...state, initiatives: state.initiatives.filter(i => i.id !== id), links: state.links.filter(l => l.fromId !== id && l.toId !== id) };
    notify();
  },

  // --- Epics ---
  addEpic: (data: Omit<Epic, 'id' | 'createdAt'>) => {
    const item: Epic = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    state = { ...state, epics: [...state.epics, item] };
    notify();
    return item;
  },
  updateEpic: (id: string, patch: Partial<Epic>) => {
    state = { ...state, epics: state.epics.map(e => e.id === id ? { ...e, ...patch } : e) };
    notify();
  },
  deleteEpic: (id: string) => {
    state = { ...state, epics: state.epics.filter(e => e.id !== id), links: state.links.filter(l => l.fromId !== id && l.toId !== id) };
    notify();
  },

  // --- Stories ---
  addStory: (data: Omit<Story, 'id' | 'createdAt'>) => {
    const item: Story = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    state = { ...state, stories: [...state.stories, item] };
    notify();
    return item;
  },
  updateStory: (id: string, patch: Partial<Story>) => {
    state = { ...state, stories: state.stories.map(s => s.id === id ? { ...s, ...patch } : s) };
    notify();
  },
  deleteStory: (id: string) => {
    state = { ...state, stories: state.stories.filter(s => s.id !== id), links: state.links.filter(l => l.fromId !== id && l.toId !== id) };
    notify();
  },

  // --- Tasks ---
  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => {
    const item: Task = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    state = { ...state, tasks: [...state.tasks, item] };
    notify();
    return item;
  },
  updateTask: (id: string, patch: Partial<Task>) => {
    state = { ...state, tasks: state.tasks.map(t => t.id === id ? { ...t, ...patch } : t) };
    notify();
  },
  deleteTask: (id: string) => {
    state = { ...state, tasks: state.tasks.filter(t => t.id !== id), links: state.links.filter(l => l.fromId !== id && l.toId !== id) };
    notify();
  },

  // --- Docs ---
  addDoc: (data: Omit<Doc, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const item: Doc = { ...data, id: uuid(), createdAt: now, updatedAt: now };
    state = { ...state, docs: [...state.docs, item] };
    notify();
    return item;
  },
  updateDoc: (id: string, patch: Partial<Doc>) => {
    state = { ...state, docs: state.docs.map(d => d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d) };
    notify();
  },
  deleteDoc: (id: string) => {
    state = { ...state, docs: state.docs.filter(d => d.id !== id), links: state.links.filter(l => l.fromId !== id && l.toId !== id) };
    notify();
  },

  // --- Helpers ---
  getEntityById: (id: string, type: EntityType) => {
    const collection = state[type === 'okr' ? 'okrs' : type === 'initiative' ? 'initiatives' : type === 'epic' ? 'epics' : type === 'story' ? 'stories' : type === 'task' ? 'tasks' : 'docs'] as Array<{ id: string }>;
    return collection.find(e => e.id === id);
  },

  getEntityTitle: (id: string, type: EntityType): string => {
    const entity = store.getEntityById(id, type);
    if (!entity) return '(deleted)';
    if (type === 'okr') return (entity as OKR).objective;
    return (entity as unknown as { title: string }).title;
  },

  seedDemo: () => {
    if (state.okrs.length > 0) return;
    const okr = store.addOKR({
      objective: 'Increase user engagement by 40%',
      keyResults: [
        { id: uuid(), title: 'DAU growth to 50k', target: 50000, current: 32000, unit: 'users' },
        { id: uuid(), title: 'Session duration > 8 min', target: 8, current: 5.2, unit: 'min' },
      ],
      period: 'Q1 2026',
      status: 'active',
    });

    const initiative = store.addInitiative({ title: 'Gamification system', description: 'Add gamification to increase retention', type: 'engineering', status: 'active', owner: 'Product Team' });
    const marketingInit = store.addInitiative({ title: 'Referral campaign', description: 'Launch user referral program', type: 'marketing', status: 'active', owner: 'Marketing Team' });

    store.addLink(initiative.id, 'initiative', okr.id, 'okr', 'contributes_to');
    store.addLink(marketingInit.id, 'initiative', okr.id, 'okr', 'contributes_to');

    const epic = store.addEpic({ title: 'Achievement system', description: 'Implement achievements and badges', status: 'in_progress' });
    store.addLink(epic.id, 'epic', initiative.id, 'initiative', 'part_of');

    const story1 = store.addStory({ title: 'Achievement data model', description: 'Design DB schema for achievements', status: 'done', points: 5 });
    const story2 = store.addStory({ title: 'Achievement UI components', description: 'Build React components for badges', status: 'in_progress', points: 8 });
    const story3 = store.addStory({ title: 'Achievement triggers', description: 'Implement event-based triggers', status: 'draft', points: 13 });

    store.addLink(story1.id, 'story', epic.id, 'epic', 'part_of');
    store.addLink(story2.id, 'story', epic.id, 'epic', 'part_of');
    store.addLink(story3.id, 'story', epic.id, 'epic', 'part_of');

    const task1 = store.addTask({ title: 'Create migrations', description: 'Write SQL migrations for achievements', status: 'done', assignee: 'Alex' });
    const task2 = store.addTask({ title: 'Badge component', description: 'SVG badge rendering component', status: 'in_progress', assignee: 'Maria' });
    const task3 = store.addTask({ title: 'Badge list view', description: 'User profile badge list', status: 'draft', assignee: 'Maria' });

    store.addLink(task1.id, 'task', story1.id, 'story', 'part_of');
    store.addLink(task2.id, 'task', story2.id, 'story', 'part_of');
    store.addLink(task3.id, 'task', story2.id, 'story', 'part_of');

    const doc = store.addDoc({ title: 'Gamification PRD', content: '# Gamification PRD\n\nThis document describes the gamification system architecture.\n\n## Goals\n- Increase DAU by 25%\n- Improve session duration\n\n## Approach\nAchievement-based gamification with social sharing.' });
    store.addLink(doc.id, 'doc', story2.id, 'story', 'documents');
    store.addLink(doc.id, 'doc', initiative.id, 'initiative', 'documents');
  },

  reset: () => {
    state = defaultState();
    notify();
  },
};
