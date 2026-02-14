import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import Itens from "./pages/Itens";
import Transactions from "./pages/Transactions";

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto Mono', monospace",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/principal" replace />} />
          <Route path="/principal" element={<Itens />} />
          <Route path="/transacoes" element={<Transactions />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;