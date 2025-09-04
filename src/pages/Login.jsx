// src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../components/LoginCard/LoginCard";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Verificação pseudo-autenticação
    if (username === "iglesio" && password === "iglesio") {
      // Se as credenciais estiverem corretas, redireciona para a tela de cômodos
      console.log("Login bem-sucedido!");
      navigate("/comodos");
    } else {
      // Caso contrário, exibe um alerta de erro
      alert("Usuário ou senha inválidos!");
    }
  };

  return (
    // Passa os estados e a função de login como props para LoginCard
    <LoginCard 
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  );
}