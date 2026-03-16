import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { getCurrentUser, logout } from './services/auth';

function AppShell() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-100 ring-1 ring-inset ring-indigo-500/40 hover:bg-indigo-500/20"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white shadow-sm">
                OM
              </span>
              <span className="hidden sm:inline">Order Management</span>
              <span className="hidden text-xs font-normal text-slate-300 md:inline">
                Dashboard
              </span>
            </Link>

            <nav className="ml-2 hidden items-center gap-4 text-sm text-slate-400 sm:flex">
              <Link
                to="/orders"
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-50"
              >
                Orders
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden items-center gap-2 text-xs sm:flex">
                  <span className="rounded-full bg-slate-800 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-slate-300">
                    Admin
                  </span>
                  <span className="text-slate-400">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm ring-1 ring-slate-700 hover:bg-rose-500 hover:text-white hover:ring-rose-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-400"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default AppShell;

