import {react} from "react";
import "./RegisterCard.css";
import LoginSideBar from "../LoginSideBar/LoginSideBar";
import RegisterInput from "../RegisterInput/RegisterInput";

function RegisterCard(){
    return(
        <div className="Register-card">
            {/* <h2>Login</h2> */}
            <LoginSideBar/>
            <RegisterInput/>
            </div>
    )
}

export default RegisterCard;