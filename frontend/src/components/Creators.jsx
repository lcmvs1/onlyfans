import { useEffect, useState } from "react";
import axios from "axios";

import "../css/App.css";
import defaultProfile from "../assets/user.png";

function Creators({ setSelectedCreator }) {

    const [creators, setCreators] = useState([]);

    const loadCreators = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:3000/api/users/creadores",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCreators(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        const fetchCreators = async () => {

            await loadCreators();

        };

        fetchCreators();

    }, []);

    return (

        <div className="creator-list">

            {
                creators.map((creator) => (

                    <div
                        key={creator.id}
                        className="creator-card"
                    >

                        <div className="creator-left">

                            <img
                                src={defaultProfile}
                                alt="perfil"
                                className="creator-avatar"
                            />

                            <div>

                                <h3 className="creator-name">
                                    {creator.nombre}
                                </h3>

                                <p className="creator-user">
                                    @{creator.nombre}Official
                                </p>

                            </div>

                        </div>

                        <button
                            className="follow-btn"
                            onClick={() => setSelectedCreator(creator.id)}
                        >

                            Ver perfil

                        </button>

                    </div>

                ))
            }

        </div>

    );

}

export default Creators;