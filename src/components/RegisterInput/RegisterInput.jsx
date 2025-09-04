import {react} from "react";
import "./RegisterInput.css";
import LoginSideBar from "../LoginSideBar/LoginSideBar";

function RegisterInput() {
    return (
        <form className="RegisterInput">
            <h1>Por favor, Preencha seu novo usuário e senha!</h1>

            <h3>Usuário</h3>
            <input type="text" placeholder="Digite seu novo id" className="new_username_input"/>
            <h3>Senha</h3>
            <input type="password" placeholder="Digite sua nova Senha" className="new_password_input"/>

            <button className="register-button">Cadastrar</button>
            
            <p>Já possui cadastro? <a href="/">Faça login</a></p>

        </form>
    );
}

export default RegisterInput;