import { useEffect, useState } from "react";


import axios from "axios";

import "../css/App.css";

function Feed() {

    const [showDonateModal, setShowDonateModal] = useState(false);

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [selectedPost, setSelectedPost] = useState(null);

    const [selectedCreator, setSelectedCreator] = useState(null);

    const [selectedFlans, setSelectedFlans] = useState(null);

    const [selectedAmount, setSelectedAmount] = useState(null);

    const [cardName, setCardName] = useState("");

    const [cardNumber, setCardNumber] = useState("");

    const [posts, setPosts] = useState([]);

    const loadFeed = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(

                "http://localhost:3000/api/posts/feed",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setPosts(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        const fetchFeed = async () => {

            await loadFeed();

        };

        fetchFeed();

    }, []);

    const flanOptions = [

        {
            flanes: 100,
            monto: 2
        },

        {
            flanes: 500,
            monto: 7
        },

        {
            flanes: 1000,
            monto: 12
        }

    ];

    const donateFlan = async () => {

        try {

            const token = localStorage.getItem("token");

            await axios.post(

                "http://localhost:3000/api/donations",

                {
                    creadorId: selectedCreator,
                    postId: selectedPost,
                    cantidadFlanes: selectedFlans
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            loadFeed();

        } catch (error) {

            console.log(error);

        }

    };
    const completePayment = async () => {

        if (!cardName || !cardNumber) {

            alert("Completa los datos");

            return;

        }

        await donateFlan();

        setShowPaymentModal(false);

    };

    return (

        <div className="feed-container">

            <h2 className="feed-title">
                Feed
            </h2>

            <div className="modern-post-feed">

                {
                    posts.map((post) => (

                        <div
                            key={post.id}
                            className="feed-post-card"
                        >

                            <div className="feed-post-header">

                                <img
                                    src={
                                        post.creador_foto
                                            ? `http://localhost:3000${post.creador_foto}`
                                            : ""
                                    }
                                    className="feed-post-avatar"
                                />

                                <div>

                                    <h3>
                                        {post.creador_nombre}
                                    </h3>

                                    <p>
                                        @{post.creador_nombre}Official
                                    </p>

                                </div>

                            </div>

                            <h3 className="feed-post-title">
                                {post.titulo}
                            </h3>

                            <div className="feed-post-image-wrapper">

                                <img
                                    src={`http://localhost:3000${post.imagen}`}
                                    alt=""
                                    className={
                                        post.desbloqueado
                                            ? "feed-post-image"
                                            : "feed-post-image blur-post"
                                    }
                                />

                                {
                                    !post.desbloqueado && (

                                        <div className="unlock-overlay">

                                            <button
                                                className="unlock-btn"
                                                onClick={() => {

                                                    setSelectedPost(post.id);

                                                    setSelectedCreator(post.creador_id);

                                                    setShowDonateModal(true);

                                                }}
                                            >
                                                Desbloquear contenido
                                            </button>

                                        </div>

                                    )
                                }

                            </div>

                            <div className="feed-post-content">

                                <p>

                                    {
                                        post.desbloqueado
                                            ? post.contenido
                                            : "Contenido bloqueado"
                                    }

                                </p>

                            </div>

                        </div>

                    ))
                }

            </div>

            {
                showDonateModal && (

                    <div className="donate-modal-backdrop">

                        <div className="flan-modal">

                            <h2>
                                Contenido bloqueado
                            </h2>

                            <p>
                                Dona flanes para desbloquear
                                este contenido
                            </p>

                            <div className="flan-options">

                                {
                                    flanOptions.map((option) => (

                                        <button
                                            key={option.flanes}
                                            className="flan-option-btn"
                                            onClick={() => {

                                                setSelectedFlans(option.flanes);

                                                setSelectedAmount(option.monto);

                                                setShowDonateModal(false);

                                                setShowPaymentModal(true);

                                            }}
                                        >

                                            <span>
                                                🍮 {option.flanes} Flanes
                                            </span>

                                            <small>
                                                Bs {option.monto}
                                            </small>

                                        </button>

                                    ))
                                }

                            </div>

                            <button
                                className="close-modal-btn"
                                onClick={() =>
                                    setShowDonateModal(false)
                                }
                            >
                                Cerrar
                            </button>

                        </div>

                    </div>

                )
            }

            {
                showPaymentModal && (

                    <div className="payment-backdrop">

                        <div className="payment-modal">

                            <div className="payment-left">

                                <h2>
                                    Completar compra
                                </h2>

                                <h3>
                                    Método de pago
                                </h3>

                                <div className="fake-card-box">

                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={cardName}
                                        onChange={(e) =>
                                            setCardName(e.target.value)
                                        }
                                    />

                                    <input
                                        type="text"
                                        placeholder="Número de tarjeta"
                                        value={cardNumber}
                                        onChange={(e) =>
                                            setCardNumber(e.target.value)
                                        }
                                    />

                                </div>

                                <button
                                    className="complete-payment-btn"
                                    onClick={completePayment}
                                >
                                    Completar compra
                                </button>

                            </div>

                            <div className="payment-right">

                                <h2>
                                    {selectedFlans} Flanes
                                </h2>

                                <h3>
                                    Bs {selectedAmount}
                                </h3>

                                <p>
                                    Pago simulado para desbloquear contenido.
                                </p>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>


    );



}

export default Feed;