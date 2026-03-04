import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { OKRList } from './pages/OKRList';
import { OKRDetail } from './pages/OKRDetail';
import { InitiativeList } from './pages/InitiativeList';
import { EntityDetail } from './pages/EntityDetail';
import { GenericList } from './pages/GenericList';
import { DocList } from './pages/DocList';
import { DocDetail } from './pages/DocDetail';
import { store } from './store/store';

export default function App() {
  useEffect(() => {
    store.seedDemo();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="okrs" element={<OKRList />} />
          <Route path="okrs/:id" element={<OKRDetail />} />
          <Route path="initiatives" element={<InitiativeList />} />
          <Route path="initiatives/:id" element={<EntityDetail entityType="initiative" />} />
          <Route path="epics" element={<GenericList entityType="epic" title="Epics" basePath="/epics" />} />
          <Route path="epics/:id" element={<EntityDetail entityType="epic" />} />
          <Route path="stories" element={<GenericList entityType="story" title="Stories" basePath="/stories" extraFields />} />
          <Route path="stories/:id" element={<EntityDetail entityType="story" />} />
          <Route path="tasks" element={<GenericList entityType="task" title="Tasks" basePath="/tasks" extraFields />} />
          <Route path="tasks/:id" element={<EntityDetail entityType="task" />} />
          <Route path="docs" element={<DocList />} />
          <Route path="docs/:id" element={<DocDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
