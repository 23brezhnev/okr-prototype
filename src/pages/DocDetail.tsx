import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { LinkManager } from '../components/LinkManager';
import { StatusBadge } from '../components/StatusBadge';

export function DocDetail() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const doc = s.docs.find(d => d.id === id);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState('');

  if (!doc || !id) return <div className="card">Document not found</div>;

  const docLinks = s.getLinksFor(id);
  const linkedStories = docLinks
    .filter(l => l.fromType === 'story' || l.toType === 'story')
    .map(l => {
      const storyId = l.fromType === 'story' ? l.fromId : l.toId;
      return s.stories.find(st => st.id === storyId);
    })
    .filter(Boolean);

  return (
    <div>
      <h1>{doc.title}</h1>

      {linkedStories.length > 0 && (
        <div className="card" style={{ marginBottom: 12 }}>
          <h4 style={{ margin: '0 0 8px' }}>Linked Stories Status</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {linkedStories.map(st => st && (
              <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusBadge status={st.status} />
                <span>{st.title}</span>
                {'points' in st && st.points != null && <span style={{ color: '#94a3b8', fontSize: 12 }}>{st.points} pts</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Content</h3>
          <button className="btn btn-sm" onClick={() => { setEditing(!editing); setContent(doc.content); }}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editing ? (
          <div>
            <textarea className="input" value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', minHeight: 300, fontFamily: 'monospace' }} />
            <button className="btn" style={{ marginTop: 8 }} onClick={() => { s.updateDoc(id, { content }); setEditing(false); }}>Save</button>
          </div>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', color: '#475569', lineHeight: 1.6 }}>
            {doc.content || 'No content yet. Click Edit to start writing.'}
          </div>
        )}
      </div>

      <LinkManager entityId={id} entityType="doc" />
    </div>
  );
}
