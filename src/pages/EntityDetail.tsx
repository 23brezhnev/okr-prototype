import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { StatusSelect } from '../components/StatusBadge';
import { LinkManager } from '../components/LinkManager';
import type { EntityType } from '../types';

interface Props {
  entityType: EntityType;
}

export function EntityDetail({ entityType }: Props) {
  const { id } = useParams<{ id: string }>();
  const s = useStore();

  const getEntity = () => {
    switch (entityType) {
      case 'initiative': return s.initiatives.find(i => i.id === id);
      case 'epic': return s.epics.find(e => e.id === id);
      case 'story': return s.stories.find(st => st.id === id);
      case 'task': return s.tasks.find(t => t.id === id);
      default: return undefined;
    }
  };

  const updateEntity = (patch: Record<string, unknown>) => {
    if (!id) return;
    switch (entityType) {
      case 'initiative': s.updateInitiative(id, patch); break;
      case 'epic': s.updateEpic(id, patch); break;
      case 'story': s.updateStory(id, patch); break;
      case 'task': s.updateTask(id, patch); break;
    }
  };

  const entity = getEntity();
  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  if (!entity || !id) return <div className="card">Not found</div>;

  const title = 'title' in entity ? entity.title : '';
  const description = 'description' in entity ? (entity as { description: string }).description : '';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{title}</h1>
        <StatusSelect value={entity.status} onChange={status => updateEntity({ status })} />
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Description</h3>
          <button className="btn btn-sm" onClick={() => { setEditing(!editing); setEditDesc(description); }}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editing ? (
          <div>
            <textarea className="input" value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ width: '100%', minHeight: 100 }} />
            <button className="btn" style={{ marginTop: 8 }} onClick={() => { updateEntity({ description: editDesc }); setEditing(false); }}>Save</button>
          </div>
        ) : (
          <p style={{ color: '#475569', whiteSpace: 'pre-wrap' }}>{description || 'No description'}</p>
        )}

        {'points' in entity && (
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <strong>Story Points: </strong>
            <input type="number" className="input" value={(entity as { points?: number }).points ?? ''} onChange={e => updateEntity({ points: Number(e.target.value) })} style={{ width: 60 }} />
          </div>
        )}

        {'assignee' in entity && (
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <strong>Assignee: </strong>
            <input className="input" value={(entity as { assignee?: string }).assignee ?? ''} onChange={e => updateEntity({ assignee: e.target.value })} style={{ width: 150 }} />
          </div>
        )}

        {'owner' in entity && (
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <strong>Owner: </strong>
            <input className="input" value={(entity as { owner?: string }).owner ?? ''} onChange={e => updateEntity({ owner: e.target.value })} style={{ width: 150 }} />
          </div>
        )}
      </div>

      <LinkManager entityId={id} entityType={entityType} />
    </div>
  );
}
