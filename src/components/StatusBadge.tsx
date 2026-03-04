import type { Status } from '../types';

const colors: Record<Status, string> = {
  draft: '#94a3b8',
  active: '#3b82f6',
  in_progress: '#f59e0b',
  done: '#22c55e',
  cancelled: '#ef4444',
};

const labels: Record<Status, string> = {
  draft: 'Draft',
  active: 'Active',
  in_progress: 'In Progress',
  done: 'Done',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      color: '#fff',
      background: colors[status],
    }}>
      {labels[status]}
    </span>
  );
}

export function StatusSelect({ value, onChange }: { value: Status; onChange: (s: Status) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as Status)} className="input">
      {Object.entries(labels).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </select>
  );
}
