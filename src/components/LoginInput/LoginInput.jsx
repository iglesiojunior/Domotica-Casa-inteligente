import {react} from "react";
import "./LoginInput.css";

function LoginInput() {
    return (
        <form className="LoginInput">
            <h1>Login</h1>

            <h3>Usuário</h3>
            <input type="text" placeholder="Digite seu id" className="username_input"/>
            <h3>Senha</h3>
            <input type="password" placeholder="Digite sua senha" className="password_input"/>


            <button className="login-button">Entrar</button>

            <p>Não possui cadastro? <a href="/register">Cadastre-se</a></p>
        </form>
    );
}

export default LoginInput;