import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SelectionRoom from "./pages/SelectionRoom";
import Room from "./pages/Room";
import RegisterCard from "./components/RegisterCard/RegisterCard";

// Função para checar se o usuário está autenticado (token salvo)
function isAuthenticated() {
  return !!localStorage.getItem("token");
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tela de login */}
        <Route path="/" element={<Login />} />
      
        {/*Redireciona para /register para cadastrar um novo usuário*/}
        <Route path="/register" element={<RegisterCard/>} />

        {/* Tela de seleção de cômodos (protegida) */}
        <Route
          path="/comodos"
          element={
            // isAuthenticated() ? <SelectionRoom /> : <Navigate to="/" />
            <SelectionRoom />
          }
        />

        {/* Tela individual de cômodo (protegida) */}
        <Route
          path="/comodos/:id"
          element={
            isAuthenticated() ? <Room /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

