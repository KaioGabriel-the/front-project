import React from "react";
import { Link } from "react-router-dom";
import TextBox from "../../components/TextBox";
import styles from "./Login.module.css";

const Login: React.FC = () => { 
    return (
        <div className={styles.loginContainer}>
            <h1>Bem-Vindo</h1>
            <form className={styles.loginForm}>
                <TextBox placeholder="Username" />
                <TextBox placeholder="Password" type="password" />
                <button type="submit">Entrar</button>
                <Link to="/cadastrar">Cadastrar</Link>
            </form>
        </div>
    );
}

export default Login;