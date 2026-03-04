import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

export function DocList() {
  const s = useStore();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    if (!title) return;
    s.addDoc({ title, content: '' });
    setTitle(''); setAdding(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Documentation</h1>
        <button className="btn" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : '+ New Doc'}</button>
      </div>

      {adding && (
        <div className="card" style={{ marginBottom: 16 }}>
          <input className="input" placeholder="Document title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
          <button className="btn" onClick={handleCreate}>Create</button>
        </div>
      )}

      {s.docs.map(doc => {
        const docLinks = s.getLinksFor(doc.id);
        const linkedStories = docLinks
          .filter(l => (l.fromType === 'story' || l.toType === 'story'))
          .map(l => {
            const storyId = l.fromType === 'story' ? l.fromId : l.toId;
            return s.stories.find(st => st.id === storyId);
          })
          .filter(Boolean);

        return (
          <div key={doc.id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to={`/docs/${doc.id}`}><h3 style={{ margin: 0 }}>{doc.title}</h3></Link>
              <button className="btn-danger btn-sm" onClick={() => s.deleteDoc(doc.id)}>Delete</button>
            </div>
            {linkedStories.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Linked stories: </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  {linkedStories.map(st => st && (
                    <span key={st.id} className={`story-chip story-chip-${st.status}`}>
                      {st.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0' }}>
              Updated: {new Date(doc.updatedAt).toLocaleDateString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
