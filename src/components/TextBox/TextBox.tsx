import React from "react";
import styles from "./TextBox.module.css";

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const TextBox: React.FC<TextBoxProps> = ({ placeholder, ...props }) => {
  return (
    <div className={styles.textBox}>
      <input placeholder={placeholder} {...props} />
    </div>
  );
};

export default TextBox;