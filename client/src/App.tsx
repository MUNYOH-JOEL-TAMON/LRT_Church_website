import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Pages - Public
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import SermonsPage from './pages/SermonsPage';
import EventsPage from './pages/EventsPage';

// Pages - Auth
import LoginPage from './pages/portal/LoginPage';
import RegisterPage from './pages/portal/RegisterPage';

// Pages - Portal (Protected)
import PortalDashboard from './pages/portal/PortalDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Routes (with Navbar + Footer) ── */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="sermons" element={<SermonsPage />} />
          <Route path="events" element={<EventsPage />} />
        </Route>

        {/* ── Auth Routes (no layout wrapper) ── */}
        <Route path="/portal/login" element={<LoginPage />} />
        <Route path="/portal/register" element={<RegisterPage />} />

        {/* ── Protected Member Portal Routes ── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
