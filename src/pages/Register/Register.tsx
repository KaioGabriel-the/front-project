import React from "react";
import TextBox from "../../components/TextBox";
import styles from "./Resgister.module.css";

const Register: React.FC = () => {
    return (
        <div className={styles.registerContainer}>
            <h1>Cadastro</h1>
            <form className={styles.registerForm}>
                <TextBox placeholder="Nome completo"></TextBox>
                <TextBox placeholder="Email"></TextBox>
                <TextBox placeholder="Senha"></TextBox>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
};

export default Register;