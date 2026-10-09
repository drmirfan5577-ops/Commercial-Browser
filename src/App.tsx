import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Account from "./pages/auth/Account.tsx";
import { useAuth } from "./hooks/use-auth.ts";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

function IdentityCallbackRedirect() {
  const { callback } = useAuth();
  const location = useLocation();
  return callback && location.pathname !== "/auth" ? (
    <Navigate to="/auth" replace />
  ) : null;
}

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <IdentityCallbackRedirect />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Account />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
