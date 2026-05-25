import "../css/App.css";

import { useState } from "react";

import Creators from "./Creators";
import CreatorProfile from "./CreatorProfile";

import defaultProfile from "../assets/user.png";

function FollowerDashboard({ setUser }) {

    const [selectedCreator, setSelectedCreator] = useState(null);

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

                    <button>
                        Inicio
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

                <h2 className="feed-title">
                    Creadores
                </h2>

                <div className="creator-list">

                    <Creators
                        setSelectedCreator={setSelectedCreator}
                    />

                </div>
            </main>

            {/* SIDEBAR DERECHA */}

            <aside className="right-sidebar">

                <h3 className="popular-title">
                    Populares
                </h3>

                <div className="popular-card">

                    <img
                        src={defaultProfile}
                        alt=""
                        className="popular-avatar"
                    />

                    <div>

                        <p className="popular-name">
                            Selina
                        </p>

                        <small>
                            @SelinaOfficial
                        </small>

                    </div>

                </div>

            </aside>

        </div>

    );

}

export default FollowerDashboard;