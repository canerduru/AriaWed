import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { View } from './types';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { CookieBanner } from './components/CookieBanner';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })));
const GuestManager = lazy(() => import('./components/GuestManager').then((m) => ({ default: m.GuestManager })));
const SeatingChart = lazy(() => import('./components/SeatingChart').then((m) => ({ default: m.SeatingChart })));
const VendorMarketplace = lazy(() => import('./components/VendorMarketplace').then((m) => ({ default: m.VendorMarketplace })));
const BudgetTracker = lazy(() => import('./components/BudgetTracker').then((m) => ({ default: m.BudgetTracker })));
const PlanningTimeline = lazy(() => import('./components/PlanningTimeline').then((m) => ({ default: m.PlanningTimeline })));
const CreativeStudio = lazy(() => import('./components/CreativeStudio').then((m) => ({ default: m.CreativeStudio })));
const WeddingWebsiteBuilder = lazy(() => import('./components/WeddingWebsiteBuilder').then((m) => ({ default: m.WeddingWebsiteBuilder })));
const WeddingDayMode = lazy(() => import('./components/WeddingDayMode').then((m) => ({ default: m.WeddingDayMode })));
const PostWedding = lazy(() => import('./components/PostWedding').then((m) => ({ default: m.PostWedding })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const RSVPPublicPage = lazy(() => import('./components/RSVPPublicPage').then((m) => ({ default: m.RSVPPublicPage })));
const PublicWebsite = lazy(() => import('./components/PublicWebsite').then((m) => ({ default: m.PublicWebsite })));
const AriaChat = lazy(() => import('./components/AriaChat').then((m) => ({ default: m.AriaChat })));

export const viewToPath: Record<View, string> = {
  [View.DASHBOARD]: '/dashboard',
  [View.TIMELINE]: '/timeline',
  [View.GUESTS]: '/guests',
  [View.SEATING]: '/seating',
  [View.VENDORS]: '/vendors',
  [View.BUDGET]: '/budget',
  [View.DESIGN]: '/design',
  [View.WEBSITE]: '/website',
  [View.WEDDING_DAY]: '/wedding-day',
  [View.POST_WEDDING]: '/post-wedding',
  [View.PROFILE]: '/profile',
  [View.ADMIN]: '/admin',
};

const pathToView: Record<string, View> = Object.fromEntries(
  Object.entries(viewToPath).map(([v, p]) => [p, v as View])
);

export function getViewFromPath(path: string): View {
  return pathToView[path] ?? View.DASHBOARD;
}

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
  </div>
);

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const currentView = getViewFromPath(currentPath);
  const setCurrentView = (view: View) => {
    const path = viewToPath[view];
    if (path) navigate(path);
  };

  return (
    <Layout
      currentView={currentView}
      setCurrentView={setCurrentView}
      onLogout={logout}
      userRole={user?.role ?? 'bride'}
    >
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
      <Suspense fallback={null}><AriaChat currentView={currentView} /></Suspense>
    </Layout>
  );
}

export function AppRoutes() {
  const { user } = useAuth();
  const [hasOnboarded, setHasOnboarded] = React.useState(() => {
    try {
      return localStorage.getItem('ariawed_onboarded') === 'true';
    } catch {
      return false;
    }
  });

  const handleOnboardComplete = React.useCallback(() => {
    setHasOnboarded(true);
    localStorage.setItem('ariawed_onboarded', 'true');
  }, []);

  return (
    <Routes>
      <Route path="/rsvp/:token" element={<RSVPPublicRoute />} />
      <Route path="/w/:weddingId" element={<PublicWebsiteRoute />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <><Auth /><CookieBanner /></>} />
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

      {!user ? null : !hasOnboarded && user.role !== 'admin' && user.role !== 'admin' ? (
        <Route path="*" element={<><Onboarding userRole={user.role} onComplete={handleOnboardComplete} /><CookieBanner /></>} />
      ) : (
        <>
          <Route path="/dashboard" element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} />
          <Route path="/timeline" element={<AuthenticatedLayout><PlanningTimeline /></AuthenticatedLayout>} />
          <Route path="/design" element={<AuthenticatedLayout><CreativeStudio /></AuthenticatedLayout>} />
          <Route path="/website" element={<AuthenticatedLayout><WeddingWebsiteBuilder /></AuthenticatedLayout>} />
          <Route path="/guests" element={<AuthenticatedLayout><GuestManager /></AuthenticatedLayout>} />
          <Route path="/seating" element={<AuthenticatedLayout><SeatingChart /></AuthenticatedLayout>} />
          <Route path="/vendors" element={<AuthenticatedLayout><VendorMarketplace /></AuthenticatedLayout>} />
          <Route path="/budget" element={<AuthenticatedLayout><BudgetTracker /></AuthenticatedLayout>} />
          <Route path="/wedding-day" element={<AuthenticatedLayout><WeddingDayMode /></AuthenticatedLayout>} />
          <Route path="/post-wedding" element={<AuthenticatedLayout><PostWedding /></AuthenticatedLayout>} />
          <Route path="/admin" element={<AuthenticatedLayout><AdminDashboard /></AuthenticatedLayout>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
}

function RSVPPublicRoute() {
  const { token } = useParams<{ token: string }>();
  const [guest, setGuest] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const base = (import.meta as any).env?.VITE_API_URL || '';

  React.useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Invalid link');
      return;
    }
    fetch(`${base}/api/guests/rsvp/${token}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Not found'))))
      .then((data) => {
        setGuest({
          ...data,
          childrenDetails: data.childrenDetails || [],
        });
      })
      .catch(() => setError('Guest not found'))
      .finally(() => setLoading(false));
  }, [token, base]);

  const handleSubmit = React.useCallback(
    (updated: any) => {
      if (!token || !base) return;
      fetch(`${base}/api/guests/rsvp/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rsvpStatus: updated.rsvpStatus,
          mealPreference: updated.mealPreference,
          dietaryRestrictions: updated.dietaryRestrictions,
          plusOneName: updated.plusOneName,
          childrenCount: updated.childrenCount,
          childrenDetails: updated.childrenDetails,
        }),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(setGuest)
        .catch(() => {});
    },
    [token, base]
  );

  if (loading) return <PageLoader />;
  if (error || !guest) return <div className="min-h-screen flex items-center justify-center text-slate-500">{error || 'Not found'}</div>;
  return (
    <Suspense fallback={<PageLoader />}>
      <RSVPPublicPage guest={guest} onSubmit={handleSubmit} />
    </Suspense>
  );
}

function PublicWebsiteRoute() {
  const { weddingId } = useParams<{ weddingId: string }>();
  return (
    <Suspense fallback={<PageLoader />}>
      <PublicWebsiteWrapper weddingId={weddingId} />
    </Suspense>
  );
}

function PublicWebsiteWrapper({ weddingId }: { weddingId?: string }) {
  const [website, setWebsite] = React.useState<unknown>(null);
  React.useEffect(() => {
    if (!weddingId) return;
    const base = (import.meta as any).env?.VITE_API_URL || '';
    fetch(`${base}/api/website/public/${weddingId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setWebsite)
      .catch(() => setWebsite(null));
  }, [weddingId]);
  if (!website) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  return <PublicWebsite website={website as any} />;
}
