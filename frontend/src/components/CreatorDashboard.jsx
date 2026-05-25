import { useEffect, useState } from "react";

import axios from "axios";

import "../css/App.css";

import CreatePost from "./CreatePost";
import PostList from "./PostList";

import defaultProfile from "../assets/user.png";

function CreatorDashboard({ user, setUser }) {

    const [creatorData, setCreatorData] = useState(user);

    const [posts, setPosts] = useState([]);

    const [profileImage, setProfileImage] = useState(null);

    const [bannerImage, setBannerImage] = useState(null);

    const [metaTitulo, setMetaTitulo] = useState("");

    const [metaDescripcion, setMetaDescripcion] = useState("");

    const [fechaInicio, setFechaInicio] = useState("");

    const [fechaFin, setFechaFin] = useState("");

    const [ingresos, setIngresos] = useState([]);

    const [totalFlanes, setTotalFlanes] = useState(0);

    const [totalMonto, setTotalMonto] = useState(0);

    const [showIncomeModal, setShowIncomeModal] = useState(false);

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

    };

    const loadPosts = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(

                `http://localhost:3000/api/posts?creadorId=${creatorData.id}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setPosts(response.data.posts);

        } catch (error) {

            console.log(error);

        }

    };

    const loadIngresos = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.get(

                `http://localhost:3000/api/users/ingresos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setIngresos(response.data.historial);

            setTotalFlanes(response.data.totalFlanes);

            setTotalMonto(response.data.totalMonto);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        const loadCreatorProfile = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await axios.get(

                    `http://localhost:3000/api/users/creador/${user.id}`,

                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }

                );

                setCreatorData(response.data);

            } catch (error) {

                console.log(error);

            }

        };

        loadCreatorProfile();

        loadPosts();

    }, []);

    return (

        <div className="dashboard">

            <div className="modern-profile">

                <div className="profile-banner">

                    <img
                        src={
                            creatorData.banner
                                ? `http://localhost:3000${creatorData.banner}`
                                : "https://picsum.photos/1200/500"
                        }
                        alt=""
                    />

                    <div className="banner-overlay"></div>

                </div>

                <div className="modern-profile-info">

                    <img
                        src={
                            creatorData.foto_perfil
                                ? `http://localhost:3000${creatorData.foto_perfil}`
                                : defaultProfile
                        }
                        alt="perfil"
                        className="modern-avatar"
                    />

                    <div>

                        <h1 className="modern-name">
                            {creatorData.nombre}
                        </h1>

                        <p className="modern-user">
                            @{creatorData.nombre}Official
                        </p>

                    </div>

                </div>

            </div>

            <div className="profile-upload-box">

                <h2>
                    Personalizar perfil
                </h2>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setProfileImage(e.target.files[0])
                    }
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setBannerImage(e.target.files[0])
                    }
                />

                <input
                    type="text"
                    placeholder="Meta de apoyo"
                    value={metaTitulo}
                    onChange={(e) =>
                        setMetaTitulo(e.target.value)
                    }
                />

                <textarea
                    placeholder="Descripción de la meta"
                    value={metaDescripcion}
                    onChange={(e) =>
                        setMetaDescripcion(e.target.value)
                    }
                />

                <button

                    onClick={async () => {

                        try {

                            const token =
                                localStorage.getItem("token");

                            const formData = new FormData();

                            if (profileImage) {

                                formData.append(
                                    "foto_perfil",
                                    profileImage
                                );

                            }

                            if (bannerImage) {

                                formData.append(
                                    "banner",
                                    bannerImage
                                );

                            }

                            formData.append(
                                "meta_titulo",
                                metaTitulo
                            );

                            formData.append(
                                "meta_descripcion",
                                metaDescripcion
                            );

                            await axios.put(

                                "http://localhost:3000/api/users/profile",

                                formData,

                                {
                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,
                                        "Content-Type":
                                            "multipart/form-data"
                                    }
                                }

                            );

                            const updatedUser = await axios.get(

                                `http://localhost:3000/api/users/creador/${user.id}`,

                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }

                            );

                            localStorage.setItem(
                                "user",
                                JSON.stringify(updatedUser.data)
                            );

                            setCreatorData(updatedUser.data);

                            alert("Perfil actualizado");

                        } catch (error) {

                            console.log(error);

                        }

                    }}

                >

                    Guardar perfil

                </button>

            </div>

            <CreatePost
                posts={posts}
                setPosts={setPosts}
            />

            <button
                className="open-income-btn"
                onClick={() => setShowIncomeModal(true)}
            >

                Ver reporte de ingresos

            </button>


            <PostList posts={posts} />

            {
                showIncomeModal && (

                    <div className="income-modal-backdrop">

                        <div className="income-modal">

                            <div className="income-modal-header">

                                <h2>
                                    Reporte de ingresos
                                </h2>

                                <button
                                    className="close-income-btn"
                                    onClick={() =>
                                        setShowIncomeModal(false)
                                    }
                                >
                                    ✕
                                </button>

                            </div>

                            <div className="income-filters">

                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) =>
                                        setFechaInicio(e.target.value)
                                    }
                                />

                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) =>
                                        setFechaFin(e.target.value)
                                    }
                                />

                                <button onClick={loadIngresos}>
                                    Buscar
                                </button>

                            </div>

                            <div className="income-summary">

                                <h3>
                                     Total Flanes: {totalFlanes}
                                </h3>

                                <h3>
                                     Total Bs: {totalMonto}
                                </h3>

                            </div>

                            <div className="income-list">

                                {
                                    ingresos.map((donacion) => (

                                        <div
                                            key={donacion.id}
                                            className="income-card"
                                        >

                                            <h4>
                                                {donacion.seguidor_nombre}
                                            </h4>

                                            <p>
                                                🍮 {donacion.cantidad_flanes} flanes
                                            </p>

                                            <p>
                                                Bs {donacion.monto}
                                            </p>

                                        </div>

                                    ))
                                }

                            </div>

                        </div>

                    </div>

                )
            }

            <button
                className="logout-btn"
                onClick={logout}
            >
                Cerrar sesión
            </button>

        </div >

    );

}

export default CreatorDashboard;