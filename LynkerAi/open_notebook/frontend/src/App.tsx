import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import MingliNotes from './pages/MingliNotes'
import Notebooks from './pages/Notebooks'
import NotebookDetail from './pages/NotebookDetail'
import SearchAsk from './pages/SearchAsk'
import ModelsPage from './pages/ModelsPage'
import SettingsPage from './pages/SettingsPage'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <aside className="sidebar"><Sidebar /></aside>
      <header className="header"><Header /></header>
      <main className="content">{children}</main>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <AppLayout>
      <Routes location={location}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mingli" element={<MingliNotes />} />
        <Route path="/notebooks" element={<Notebooks />} />
        <Route path="/notebooks/:id" element={<NotebookDetail />} />
        <Route path="/search" element={<SearchAsk />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  )
}
