import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useStore } from '../hooks/useStore';
import { StatusSelect } from '../components/StatusBadge';
import { LinkManager } from '../components/LinkManager';

export function OKRDetail() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const okr = s.okrs.find(o => o.id === id);
  const [krTitle, setKrTitle] = useState('');
  const [krTarget, setKrTarget] = useState('');
  const [krUnit, setKrUnit] = useState('');

  if (!okr || !id) return <div className="card">OKR not found</div>;

  const addKr = () => {
    if (!krTitle || !krTarget) return;
    s.updateOKR(id, {
      keyResults: [...okr.keyResults, { id: uuid(), title: krTitle, target: Number(krTarget), current: 0, unit: krUnit }],
    });
    setKrTitle(''); setKrTarget(''); setKrUnit('');
  };

  const updateKrCurrent = (krId: string, current: number) => {
    s.updateOKR(id, {
      keyResults: okr.keyResults.map(kr => kr.id === krId ? { ...kr, current } : kr),
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{okr.objective}</h1>
        <StatusSelect value={okr.status} onChange={status => s.updateOKR(id, { status })} />
      </div>
      <p style={{ color: '#94a3b8' }}>Period: {okr.period}</p>

      <div className="card">
        <h3>Key Results</h3>
        {okr.keyResults.map(kr => {
          const pct = kr.target > 0 ? Math.round((kr.current / kr.target) * 100) : 0;
          return (
            <div key={kr.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong>{kr.title}</strong>
                <span>{pct}%</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 4 }}>
                <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                <span>Current:</span>
                <input
                  type="number"
                  className="input"
                  value={kr.current}
                  onChange={e => updateKrCurrent(kr.id, Number(e.target.value))}
                  style={{ width: 80 }}
                />
                <span>/ {kr.target} {kr.unit}</span>
              </div>
            </div>
          );
        })}

        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <input className="input" placeholder="KR title" value={krTitle} onChange={e => setKrTitle(e.target.value)} />
          <input className="input" placeholder="Target" type="number" value={krTarget} onChange={e => setKrTarget(e.target.value)} style={{ width: 80 }} />
          <input className="input" placeholder="Unit" value={krUnit} onChange={e => setKrUnit(e.target.value)} style={{ width: 80 }} />
          <button className="btn btn-sm" onClick={addKr}>+ Add KR</button>
        </div>
      </div>

      <LinkManager entityId={id} entityType="okr" />
    </div>
  );
}
