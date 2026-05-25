import "../css/App.css";

import { useState, useEffect } from "react";
import axios from "axios";

import Creators from "./Creators";
import CreatorProfile from "./CreatorProfile";
import Feed from "./Feed";

import defaultProfile from "../assets/user.png";

function FollowerDashboard({ setUser }) {

    const [selectedCreator, setSelectedCreator] = useState(null);

    const [favoritos, setFavoritos] = useState([]);

    const [currentView, setCurrentView] = useState("home");

    const loadFavoritos = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(

                "http://localhost:3000/api/users/favoritos",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setFavoritos(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        const fetchFavoritos = async () => {

            await loadFavoritos();

        };

        fetchFavoritos();

    }, []);

    useEffect(() => {

        const handleBack = () => {

            setSelectedCreator(null);

        };

        window.onpopstate = handleBack;

        return () => {

            window.onpopstate = null;

        };

    }, []);


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    };

    if (selectedCreator) {

        return (

            <CreatorProfile
                creatorId={selectedCreator}
                goBack={() => setSelectedCreator(null)}
                loadFavoritos={loadFavoritos}
            />

        );
    }

    return (

        <div className="app-layout">


            <aside className="left-sidebar">

                <h1 className="logo">
                    OnlyFlans
                </h1>

                <nav className="sidebar-menu">

                    <button
                        onClick={() =>
                            setCurrentView("home")
                        }
                    >
                        Inicio
                    </button>

                    <button
                        onClick={() =>
                            setCurrentView("feed")
                        }
                    >
                        Feed
                    </button>

                    <button>
                        Perfil
                    </button>

                    <button onClick={logout}>
                        Cerrar sesión
                    </button>

                </nav>

            </aside>


            <main className="main-feed">
                {
                    currentView === "home" ? (

                        <>
                            <h2 className="feed-title">
                                Creadores
                            </h2>

                            <div className="creator-list">

                                <Creators
                                    setSelectedCreator={(id) => {

                                        window.history.pushState(
                                            {},
                                            "",
                                            `/creator/${id}`
                                        );

                                        setSelectedCreator(id);

                                    }}
                                />

                            </div>
                        </>

                    ) : (

                        <Feed />

                    )
                }
            </main>

            {/* SIDEBAR DERECHA */}

            <aside className="right-sidebar">

                <h3 className="popular-title">
                    Favoritos
                </h3>

                {
                    favoritos.length > 0 ? (

                        favoritos.map((creator) => (

                            <div
                                key={creator.id}
                                className="popular-card"

                                onClick={() => {

                                    window.history.pushState(
                                        {},
                                        "",
                                        `/creator/${creator.id}`
                                    );

                                    setSelectedCreator(creator.id);

                                }}
                            >

                                <img
                                    src={
                                        creator.foto_perfil
                                            ? `http://localhost:3000${creator.foto_perfil}`
                                            : defaultProfile
                                    }

                                    alt=""

                                    className="popular-avatar"
                                />

                                <div>

                                    <p className="popular-name">
                                        {creator.nombre}
                                    </p>

                                    <small>
                                        @{creator.nombre}Official
                                    </small>

                                </div>

                            </div>

                        ))

                    ) : (

                        <p className="no-favorites">
                            No tienes favoritos
                        </p>

                    )
                }

            </aside>

        </div>

    );

}

export default FollowerDashboard;