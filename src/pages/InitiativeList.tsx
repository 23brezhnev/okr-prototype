import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { StatusSelect } from '../components/StatusBadge';
import type { InitiativeType, Status } from '../types';

const typeLabels: Record<InitiativeType, string> = {
  engineering: 'Engineering',
  marketing: 'Marketing',
  sales: 'Sales',
  operations: 'Operations',
  other: 'Other',
};

export function InitiativeList() {
  const s = useStore();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<InitiativeType>('engineering');
  const [owner, setOwner] = useState('');

  const handleCreate = () => {
    if (!title) return;
    s.addInitiative({ title, description: desc, type, status: 'active' as Status, owner });
    setTitle(''); setDesc(''); setOwner(''); setAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Initiatives</h1>
        <button className="btn" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : '+ New Initiative'}</button>
      </div>

      {adding && (
        <div className="card" style={{ marginBottom: 16 }}>
          <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
          <textarea className="input" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} style={{ width: '100%', marginBottom: 8 }} rows={2} />
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select className="input" value={type} onChange={e => setType(e.target.value as InitiativeType)}>
              {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input className="input" placeholder="Owner" value={owner} onChange={e => setOwner(e.target.value)} />
          </div>
          <button className="btn" onClick={handleCreate}>Create</button>
        </div>
      )}

      {s.initiatives.map(item => (
        <div key={item.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to={`/initiatives/${item.id}`}><h3 style={{ margin: 0 }}>{item.title}</h3></Link>
              <span className="entity-type-badge">{typeLabels[item.type]}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <StatusSelect value={item.status} onChange={status => s.updateInitiative(item.id, { status })} />
              <button className="btn-danger btn-sm" onClick={() => s.deleteInitiative(item.id)}>Delete</button>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0' }}>{item.description}</p>
          {item.owner && <span style={{ fontSize: 12, color: '#94a3b8' }}>Owner: {item.owner}</span>}
        </div>
      ))}
    </div>
  );
}
