import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./AdminLogin.module.css";
import { adminLogin } from "../../api/admin";
import { toast } from "react-toastify";

const AnimatedLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!email) {
      setErrorEmail("Email is required.");
      valid = false;
    } else {
      setErrorEmail(null);
    }

    if (!password) {
      setErrorPassword("Password is required.");
      valid = false;
    } else {
      setErrorPassword(null);
    }

    if (valid) {
      const response = await adminLogin({ email, password });

      if (response.data === true) {
        toast.success("Admin login successful");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.loginSection}>
          <header>
            <h2
              className={`${styles.animation} ${styles.a1} ${styles.text3xl}`}
            >
              Admin Login
            </h2>
            <h4 className={`${styles.animation} ${styles.a2}`}>
              Welcome back Admin
            </h4>
          </header>
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`${styles.relative} ${styles.inputContainer}`}
            >
              <input
                type="email"
                placeholder="Email"
                className={`${styles.inputField} ${styles.animation} ${styles.a3}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorEmail && (
                <p className={styles.errorMessage}>{errorEmail}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`${styles.relative} ${styles.inputContainer}`}
            >
              <input
                type="password"
                placeholder="Password"
                className={`${styles.inputField} ${styles.animation} ${styles.a4}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorPassword && (
                <p className={styles.errorMessage}>{errorPassword}</p>
              )}
            </motion.div>
            <p className={`${styles.animation} ${styles.a5}`}>
              <a href="#">Forgot password?</a>
            </p>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${styles.animation} ${styles.a6}`}
            >
              Sign in
            </motion.button>
          </form>
        </div>
      </div>
      <div className={styles.right}></div>
    </div>
  );
};

export default AnimatedLoginPage;
