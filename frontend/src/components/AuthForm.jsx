import { useState } from "react";
import axios from "axios";
import "../css/App.css";

function AuthForm({ setUser }) {

    const [isLogin, setIsLogin] = useState(true);

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("seguidor");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    // LOGIN

    const login = async () => {

        setError("");

        if (!email || !password) {

            setError("Completa todos los campos");

            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            setError("Correo inválido");

            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setUser(response.data.user);

            setLoading(false);

        } catch (error) {

            console.log(error);

            setLoading(false);

            setError("Correo o contraseña incorrectos");

        }

    };

    // REGISTER

    const register = async () => {

        setError("");

        if (!nombre || !email || !password) {

            setError("Completa todos los campos");

            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            setError("Correo inválido");

            return;
        }

        if (password.length < 6) {

            setError(
                "La contraseña debe tener mínimo 6 caracteres"
            );

            return;
        }

        try {

            setLoading(true);

            await axios.post(
                "http://localhost:3000/api/auth/register",
                {
                    nombre,
                    email,
                    password,
                    rol
                }
            );

            setLoading(false);

            alert("Usuario registrado");

            setNombre("");
            setEmail("");
            setPassword("");
            setRol("seguidor");

            setIsLogin(true);

        } catch (error) {

            console.log(error);

            setLoading(false);

            setError("Error al registrar usuario");

        }

    };

    return (

        <div className="container">

            {/* PANEL IZQUIERDO */}

            <div className="left-panel">

                <div className="overlay"></div>

                <div className="content">

                    <div className="logo">

                        <h1 className="logo-text">

                            <span>OnlyFl</span>

                            <span className="flan-icon">
                                🍮
                            </span>

                            <span>ns</span>

                        </h1>

                    </div>

                    <p>
                        Apoya a tus creadores favoritos
                        con flanes y descubre contenido exclusivo.
                    </p>

                </div>

            </div>

            {/* PANEL DERECHO */}

            <div className="right-panel">

                <div className="form-box">

                    <h2>
                        {
                            isLogin
                                ? "Iniciar Sesión"
                                : "Crear Cuenta"
                        }
                    </h2>

                    {
                        error && (
                            <p className="error-text">
                                {error}
                            </p>
                        )
                    }

                    {
                        !isLogin && (
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) =>
                                    setNombre(e.target.value)
                                }
                            />
                        )
                    }

                    <input
                        type="email"
                        placeholder="Correo"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    {
                        !isLogin && (
                            <select
                                value={rol}
                                onChange={(e) =>
                                    setRol(e.target.value)
                                }
                            >
                                <option value="seguidor">
                                    Seguidor
                                </option>

                                <option value="creador">
                                    Creador
                                </option>

                            </select>
                        )
                    }

                    <button
                        disabled={loading}
                        onClick={
                            isLogin
                                ? login
                                : register
                        }
                    >

                        {
                            loading
                                ? "CARGANDO..."
                                : (
                                    isLogin
                                        ? "INICIAR SESIÓN"
                                        : "REGISTRARSE"
                                )
                        }

                    </button>

                    <p className="switch-text">

                        {
                            isLogin
                                ? "¿No tienes cuenta?"
                                : "¿Ya tienes cuenta?"
                        }

                        <span
                            onClick={() => {

                                setIsLogin(!isLogin);

                                setError("");

                                setNombre("");
                                setEmail("");
                                setPassword("");

                            }}
                        >

                            {
                                isLogin
                                    ? " Registrarse"
                                    : " Iniciar sesión"
                            }

                        </span>

                    </p>

                </div>

            </div>

        </div>

    );

}

export default AuthForm;