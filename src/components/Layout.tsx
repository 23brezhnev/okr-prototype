import { NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/okrs', label: 'OKRs' },
  { to: '/initiatives', label: 'Initiatives' },
  { to: '/epics', label: 'Epics' },
  { to: '/stories', label: 'Stories' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/docs', label: 'Docs' },
];

export function Layout() {
  const s = useStore();
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="logo">ProductTracker</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.to === '/'}
          >
            {item.label}
          </NavLink>
        ))}
        <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid #e2e8f0' }}>
          <button className="btn btn-sm" onClick={() => { s.reset(); s.seedDemo(); }} style={{ width: '100%' }}>
            Reset Demo Data
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
