import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import AnamnesisPage from "./pages/AnamnesisPage";
import DashboardCustomersPage from "./pages/DashboardCustomersPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardPaymentsPage from "./pages/DashboardPaymentsPage";
import HomePage from "./pages/HomePage";
import PaymentPage from "./pages/PaymentPage";
import TherapistLoginPage from "./pages/TherapistLoginPage";
import DashboardAnamnesesPage from "./pages/DashboardAnamnesesPage";
import DashboardAnamnesisDetailPage from "./pages/DashboardAnamnesisDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/pagamento"
          element={<PaymentPage />}
        />

        <Route
          path="/anamnese"
          element={<AnamnesisPage />}
        />

        <Route
          path="/acesso-terapeuta"
          element={<TherapistLoginPage />}
        />

        <Route
          path="/painel"
          element={<DashboardPage />}
        />

        <Route
          path="/painel/clientes"
          element={<DashboardCustomersPage />}
        />

        <Route
          path="/painel/pagamentos"
          element={<DashboardPaymentsPage />}
        />
        <Route
          path="/painel/anamneses"
          element={<DashboardAnamnesesPage />}
        />
        <Route
          path="/painel/anamneses/:anamnesisId"
          element={<DashboardAnamnesisDetailPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
   

export default App;