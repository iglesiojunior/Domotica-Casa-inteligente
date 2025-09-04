import {react} from "react";
import "./LoginCard.css";
import LoginInput from "../LoginInput/LoginInput";
import LoginSideBar from "../LoginSideBar/LoginSideBar";

function LoginCard(){
    return(
        <div className="login-card">
            {/* <h2>Login</h2> */}
            <LoginSideBar/>
            <LoginInput />
            </div>
    )
}

export default LoginCard;