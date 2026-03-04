import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { StatusSelect } from '../components/StatusBadge';
import type { Status } from '../types';

interface Props {
  entityType: 'epic' | 'story' | 'task';
  title: string;
  basePath: string;
  extraFields?: boolean;
}

export function GenericList({ entityType, title, basePath, extraFields: _extraFields }: Props) {
  const s = useStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [points, setPoints] = useState('');
  const [assignee, setAssignee] = useState('');

  const items = entityType === 'epic' ? s.epics : entityType === 'story' ? s.stories : s.tasks;

  const handleCreate = () => {
    if (!name) return;
    const base = { title: name, description: desc, status: 'draft' as Status };
    if (entityType === 'epic') s.addEpic(base);
    else if (entityType === 'story') s.addStory({ ...base, points: points ? Number(points) : undefined });
    else s.addTask({ ...base, assignee: assignee || undefined });
    setName(''); setDesc(''); setPoints(''); setAssignee(''); setAdding(false);
  };

  const handleDelete = (id: string) => {
    if (entityType === 'epic') s.deleteEpic(id);
    else if (entityType === 'story') s.deleteStory(id);
    else s.deleteTask(id);
  };

  const handleStatus = (id: string, status: Status) => {
    if (entityType === 'epic') s.updateEpic(id, { status });
    else if (entityType === 'story') s.updateStory(id, { status });
    else s.updateTask(id, { status });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{title}</h1>
        <button className="btn" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : `+ New ${entityType}`}</button>
      </div>

      {adding && (
        <div className="card" style={{ marginBottom: 16 }}>
          <input className="input" placeholder="Title" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
          <textarea className="input" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} style={{ width: '100%', marginBottom: 8 }} rows={2} />
          {entityType === 'story' && (
            <input className="input" placeholder="Story Points" type="number" value={points} onChange={e => setPoints(e.target.value)} style={{ marginBottom: 8, width: 120 }} />
          )}
          {entityType === 'task' && (
            <input className="input" placeholder="Assignee" value={assignee} onChange={e => setAssignee(e.target.value)} style={{ marginBottom: 8 }} />
          )}
          <button className="btn" onClick={handleCreate}>Create</button>
        </div>
      )}

      {items.map(item => (
        <div key={item.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to={`${basePath}/${item.id}`}><h3 style={{ margin: 0 }}>{item.title}</h3></Link>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {'points' in item && (item as { points?: number }).points != null && <span style={{ fontSize: 12, color: '#94a3b8' }}>{(item as { points: number }).points} pts</span>}
              {'assignee' in item && (item as { assignee?: string }).assignee && <span style={{ fontSize: 12, color: '#94a3b8' }}>{(item as { assignee: string }).assignee}</span>}
              <StatusSelect value={item.status} onChange={status => handleStatus(item.id, status)} />
              <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
          {item.description && <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0' }}>{item.description}</p>}
        </div>
      ))}
    </div>
  );
}
