import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import type { EntityType } from '../types';
import { StatusBadge } from './StatusBadge';

const typeLabels: Record<EntityType, string> = {
  okr: 'OKR',
  initiative: 'Initiative',
  epic: 'Epic',
  story: 'Story',
  task: 'Task',
  doc: 'Doc',
};

const relationOptions = ['contributes_to', 'part_of', 'blocks', 'related', 'documents'];

interface Props {
  entityId: string;
  entityType: EntityType;
}

export function LinkManager({ entityId, entityType }: Props) {
  const s = useStore();
  const links = s.getLinksFor(entityId);
  const [adding, setAdding] = useState(false);
  const [targetType, setTargetType] = useState<EntityType>('okr');
  const [targetId, setTargetId] = useState('');
  const [relation, setRelation] = useState('related');

  const getCollection = (type: EntityType) => {
    switch (type) {
      case 'okr': return s.okrs;
      case 'initiative': return s.initiatives;
      case 'epic': return s.epics;
      case 'story': return s.stories;
      case 'task': return s.tasks;
      case 'doc': return s.docs;
    }
  };

  const handleAdd = () => {
    if (!targetId) return;
    s.addLink(entityId, entityType, targetId, targetType, relation);
    setAdding(false);
    setTargetId('');
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h4 style={{ margin: 0 }}>Links</h4>
        <button className="btn btn-sm" onClick={() => setAdding(!adding)}>
          {adding ? 'Cancel' : '+ Link'}
        </button>
      </div>

      {adding && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <select className="input" value={targetType} onChange={e => { setTargetType(e.target.value as EntityType); setTargetId(''); }}>
            {Object.entries(typeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select className="input" value={targetId} onChange={e => setTargetId(e.target.value)}>
            <option value="">Select...</option>
            {getCollection(targetType).filter(e => e.id !== entityId).map(e => (
              <option key={e.id} value={e.id}>
                {'objective' in e ? e.objective : e.title}
              </option>
            ))}
          </select>
          <select className="input" value={relation} onChange={e => setRelation(e.target.value)}>
            {relationOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button className="btn" onClick={handleAdd}>Add</button>
        </div>
      )}

      {links.length === 0 && <p style={{ color: '#94a3b8', fontSize: 13 }}>No links yet</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {links.map(link => {
          const otherId = link.fromId === entityId ? link.toId : link.fromId;
          const otherType = link.fromId === entityId ? link.toType : link.fromType;
          const entity = s.getEntityById(otherId, otherType);
          const direction = link.fromId === entityId ? '->' : '<-';
          return (
            <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontFamily: 'monospace' }}>{direction}</span>
              <span className="entity-type-badge">{typeLabels[otherType]}</span>
              <span style={{ fontWeight: 500 }}>{s.getEntityTitle(otherId, otherType)}</span>
              <span style={{ color: '#94a3b8', fontSize: 11 }}>{link.relation}</span>
              {entity && 'status' in entity && <StatusBadge status={(entity as { status: 'draft' }).status} />}
              <button onClick={() => s.removeLink(link.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>x</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
