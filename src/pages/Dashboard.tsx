import { useStore } from '../hooks/useStore';
import { StatusBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import type { Status } from '../types';

export function Dashboard() {
  const s = useStore();

  const countByStatus = (items: Array<{ status: Status }>) => {
    const counts: Record<string, number> = {};
    items.forEach(i => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return counts;
  };

  const sections = [
    { label: 'OKRs', items: s.okrs, path: '/okrs' },
    { label: 'Initiatives', items: s.initiatives, path: '/initiatives' },
    { label: 'Epics', items: s.epics, path: '/epics' },
    { label: 'Stories', items: s.stories, path: '/stories' },
    { label: 'Tasks', items: s.tasks, path: '/tasks' },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid">
        {sections.map(sec => {
          const counts = countByStatus(sec.items as Array<{ status: Status }>);
          return (
            <Link to={sec.path} key={sec.label} className="card card-link">
              <h3>{sec.label}</h3>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{sec.items.length}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(counts).map(([status, count]) => (
                  <span key={status} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StatusBadge status={status as Status} /> {count}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
        <Link to="/docs" className="card card-link">
          <h3>Docs</h3>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{s.docs.length}</div>
        </Link>
      </div>

      <h2 style={{ marginTop: 32 }}>Active OKRs</h2>
      {s.okrs.filter(o => o.status === 'active').map(okr => (
        <div key={okr.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to={`/okrs/${okr.id}`}><h3 style={{ margin: 0 }}>{okr.objective}</h3></Link>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>{okr.period}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            {okr.keyResults.map(kr => {
              const pct = kr.target > 0 ? Math.round((kr.current / kr.target) * 100) : 0;
              return (
                <div key={kr.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 2 }}>
                    <span>{kr.title}</span>
                    <span>{kr.current} / {kr.target} {kr.unit} ({pct}%)</span>
                  </div>
                  <div className="progress-bar">
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
