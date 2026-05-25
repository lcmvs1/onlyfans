import { useEffect, useState } from "react";
import axios from "axios";

import "../css/App.css";
import defaultProfile from "../assets/user.png";


function CreatorProfile({ creatorId , loadFavoritos}) {

    const [creator, setCreator] = useState(null);

    const [posts, setPosts] = useState([]);

    const [, setHasDonated] = useState(false);


    const [, setMessage] = useState("");

    const [showDonateModal, setShowDonateModal] = useState(false);

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [selectedFlans, setSelectedFlans] = useState(null);

    const [selectedAmount, setSelectedAmount] = useState(null);

    const [cardName, setCardName] = useState("");

    const [cardNumber, setCardNumber] = useState("");

    const [commentText, setCommentText] = useState({});

    const [selectedPost, setSelectedPost] = useState(null);

    const [isFavorite, setIsFavorite] = useState(false);

    const [isFollowing, setIsFollowing] = useState(false);

    const checkFavorite = async () => {

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

            const exists = response.data.some(

                fav => fav.id === creatorId

            );

            setIsFavorite(exists);

        } catch (error) {

            console.log(error);

        }

    };

    const loadProfile = async () => {

        try {

            const token = localStorage.getItem("token");



            const creatorResponse = await axios.get(

                `http://localhost:3000/api/users/creador/${creatorId}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setCreator(creatorResponse.data);

            const postsResponse = await axios.get(

                `http://localhost:3000/api/posts?creadorId=${creatorId}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setHasDonated(postsResponse.data.hasDonated);

            setPosts(postsResponse.data.posts);
            console.log(postsResponse.data.posts);

            if (!postsResponse.data.hasDonated) {

                setMessage(postsResponse.data.message);

            }

        } catch (error) {

            console.log(error);

        }

    };

    const checkFollowing = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.get(

                `http://localhost:3000/api/users/is-following/${creatorId}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setIsFollowing(response.data.following);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        const fetchProfile = async () => {

            await loadProfile();
            await checkFavorite();
            await checkFollowing();

        };

        fetchProfile();

    }, []);

    const donateFlan = async (postId, cantidadFlanes) => {

        try {

            const token = localStorage.getItem("token");

            await axios.post(

                "http://localhost:3000/api/donations",

                {
                    creadorId: creatorId,
                    postId,
                    cantidadFlanes
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setHasDonated(true);

            loadProfile();
            loadFavoritos();

        } catch (error) {

            console.log(error);

        }

    };

    const completePayment = async () => {

        if (!cardName || !cardNumber) {

            alert("Completa los datos");

            return;

        }

        await donateFlan(
            selectedPost,
            selectedFlans
        );

        setShowPaymentModal(false);

    }

    const createComment = async (postId) => {

        try {

            const token = localStorage.getItem("token");

            if (!commentText[postId]) {

                return;

            }

            await axios.post(

                "http://localhost:3000/api/comments",

                {
                    postId: postId,
                    contenido: commentText[postId]
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setCommentText({

                ...commentText,

                [postId]: ""

            });

            loadProfile();

        } catch (error) {

            console.log(error);

        }

    };

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



    return (

        <div className="modern-profile">


            {
                creator && (

                    <>

                        {/* BANNER */}

                        <div className="profile-banner">

                            <img
                                src={
                                    creator.banner
                                        ? `http://localhost:3000${creator.banner}`
                                        : "https://picsum.photos/1200/500"
                                }
                                alt=""
                            />

                            <div className="banner-overlay"></div>

                        </div>

                        {/* INFO */}

                        <div className="modern-profile-info">

                            <img
                                src={
                                    creator.foto_perfil
                                        ? `http://localhost:3000${creator.foto_perfil}`
                                        : defaultProfile
                                }
                                alt="perfil"
                                className="modern-avatar"
                            />

                            <div>

                                <h1 className="modern-name">
                                    {creator.nombre}
                                </h1>

                                <p className="modern-user">
                                    @{creator.nombre}Official
                                </p>

                                <div className="profile-action-buttons">

                                    <button
                                        className={
                                            isFollowing
                                                ? "following-btn"
                                                : "follow-btn-profile"
                                        }

                                        onClick={async () => {

                                            try {

                                                const token =
                                                    localStorage.getItem("token");

                                                if (!isFollowing) {

                                                    await axios.post(

                                                        "http://localhost:3000/api/users/follow",

                                                        {
                                                            creadorId: creator.id
                                                        },

                                                        {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        }

                                                    );

                                                    setIsFollowing(true);

                                                }

                                                else {

                                                    await axios.delete(

                                                        `http://localhost:3000/api/users/unfollow/${creator.id}`,

                                                        {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        }

                                                    );

                                                    setIsFollowing(false);

                                                }

                                            } catch (error) {

                                                console.log(error);

                                            }

                                        }}
                                    >

                                        {
                                            isFollowing
                                                ? "Following"
                                                : "Follow"
                                        }

                                    </button>


                                    <button
                                        className="favorite-btn"

                                        onClick={async () => {

                                            try {

                                                const token =
                                                    localStorage.getItem("token");

                                                if (!isFavorite) {

                                                    await axios.post(

                                                        "http://localhost:3000/api/users/favoritos",

                                                        {
                                                            creadorId: creator.id
                                                        },

                                                        {
                                                            headers: {
                                                                Authorization:
                                                                    `Bearer ${token}`
                                                            }
                                                        }

                                                    );

                                                    setIsFavorite(true);

                                                    await loadFavoritos();

                                                }

                                                else {

                                                    await axios.delete(

                                                        `http://localhost:3000/api/users/favoritos/${creator.id}`,

                                                        {
                                                            headers: {
                                                                Authorization:
                                                                    `Bearer ${token}`
                                                            }
                                                        }

                                                    );

                                                    setIsFavorite(false);

                                                    await loadFavoritos();

                                                }

                                            } catch (error) {

                                                console.log(error);

                                            }

                                        }}
                                    >

                                        <i
                                            className={
                                                isFavorite
                                                    ? "bi bi-star-fill"
                                                    : "bi bi-star"
                                            }
                                        ></i>

                                    </button>

                                </div>

                            </div>

                        </div>

                        {
                            creator.meta_titulo && (

                                <div className="support-goal-card">

                                    <h2 className="support-goal-title">
                                        {creator.meta_titulo}
                                    </h2>

                                    <p className="support-goal-description">
                                        {creator.meta_descripcion}
                                    </p>

                                </div>

                            )
                        }

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
                                                        : defaultProfile
                                                }
                                                className="feed-post-avatar"
                                            />

                                            <div>

                                                <h3>
                                                    {creator.nombre}
                                                </h3>

                                                <p>
                                                    @{creator.nombre}Official
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

                                            {
                                                post.desbloqueado && (

                                                    <div className="comment-section">

                                                        <textarea
                                                            placeholder="Escribe un comentario..."
                                                            value={commentText[post.id] || ""}
                                                            onChange={(e) =>

                                                                setCommentText({

                                                                    ...commentText,

                                                                    [post.id]: e.target.value

                                                                })

                                                            }
                                                            className="comment-input"
                                                        />

                                                        <button
                                                            className="comment-btn"
                                                            onClick={() => createComment(post.id)}
                                                        >
                                                            Comentar
                                                        </button>

                                                    </div>

                                                )
                                            }

                                            <div className="creator-comments">

                                                <h4>
                                                    Comentarios
                                                </h4>

                                                {
                                                    post.comentarios &&
                                                        post.comentarios.length > 0 ? (

                                                        post.comentarios.map((comment) => (

                                                            <div
                                                                key={comment.id}
                                                                className="comment-card"
                                                            >

                                                                <img
                                                                    src={defaultProfile}
                                                                    alt=""
                                                                    className="comment-avatar"
                                                                />

                                                                <div className="comment-content">

                                                                    <span className="comment-user">
                                                                        {comment.seguidor_nombre}
                                                                    </span>

                                                                    <span className="comment-text">
                                                                        {comment.contenido}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        ))

                                                    ) : (

                                                        <p>
                                                            No hay comentarios
                                                        </p>

                                                    )
                                                }

                                            </div>

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

                    </>

                )
            }

        </div>

    );

}

export default CreatorProfile;