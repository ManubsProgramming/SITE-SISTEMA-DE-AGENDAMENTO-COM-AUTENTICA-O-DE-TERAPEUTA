import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import PaymentPage from "./pages/PaymentPage";
import AnamnesisPage from "./pages/AnamnesisPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/pagamento"
          element={<PaymentPage />}
        />

        <Route
          path="/anamnese"
          element={<AnamnesisPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;