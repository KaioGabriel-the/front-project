import React from "react";
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
                <a href="">Cadastrar</a>
            </form>
        </div>
    );
}

export default Login;