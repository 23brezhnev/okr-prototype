import { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useStore } from '../hooks/useStore';
import { StatusSelect } from '../components/StatusBadge';
import type { Status } from '../types';

export function OKRList() {
  const s = useStore();
  const [adding, setAdding] = useState(false);
  const [objective, setObjective] = useState('');
  const [period, setPeriod] = useState('Q1 2026');
  const [krTitle, setKrTitle] = useState('');
  const [krTarget, setKrTarget] = useState('');
  const [krUnit, setKrUnit] = useState('');
  const [krs, setKrs] = useState<Array<{ id: string; title: string; target: number; current: number; unit: string }>>([]);

  const addKr = () => {
    if (!krTitle || !krTarget) return;
    setKrs([...krs, { id: uuid(), title: krTitle, target: Number(krTarget), current: 0, unit: krUnit }]);
    setKrTitle(''); setKrTarget(''); setKrUnit('');
  };

  const handleCreate = () => {
    if (!objective) return;
    s.addOKR({ objective, keyResults: krs, period, status: 'active' as Status });
    setObjective(''); setKrs([]); setAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>OKRs</h1>
        <button className="btn" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : '+ New OKR'}</button>
      </div>

      {adding && (
        <div className="card" style={{ marginBottom: 16 }}>
          <input className="input" placeholder="Objective" value={objective} onChange={e => setObjective(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
          <input className="input" placeholder="Period (e.g. Q1 2026)" value={period} onChange={e => setPeriod(e.target.value)} style={{ marginBottom: 8 }} />
          <h4>Key Results</h4>
          {krs.map((kr, i) => (
            <div key={kr.id} style={{ fontSize: 13, marginBottom: 4 }}>
              {i + 1}. {kr.title} — target: {kr.target} {kr.unit}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <input className="input" placeholder="KR title" value={krTitle} onChange={e => setKrTitle(e.target.value)} />
            <input className="input" placeholder="Target" type="number" value={krTarget} onChange={e => setKrTarget(e.target.value)} style={{ width: 100 }} />
            <input className="input" placeholder="Unit" value={krUnit} onChange={e => setKrUnit(e.target.value)} style={{ width: 100 }} />
            <button className="btn btn-sm" onClick={addKr}>+ KR</button>
          </div>
          <button className="btn" onClick={handleCreate}>Create OKR</button>
        </div>
      )}

      {s.okrs.map(okr => (
        <div key={okr.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to={`/okrs/${okr.id}`}><h3 style={{ margin: 0 }}>{okr.objective}</h3></Link>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>{okr.period}</span>
              <StatusSelect value={okr.status} onChange={status => s.updateOKR(okr.id, { status })} />
              <button className="btn-danger btn-sm" onClick={() => s.deleteOKR(okr.id)}>Delete</button>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            {okr.keyResults.map(kr => {
              const pct = kr.target > 0 ? Math.round((kr.current / kr.target) * 100) : 0;
              return (
                <div key={kr.id} style={{ marginBottom: 6, fontSize: 13 }}>
                  <span>{kr.title}: {kr.current}/{kr.target} {kr.unit} ({pct}%)</span>
                  <div className="progress-bar" style={{ marginTop: 2 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
