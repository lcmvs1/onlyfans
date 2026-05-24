import { useEffect, useState } from "react";

import axios from "axios";

import "../css/App.css";

function Feed() {

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

    return (

        <div className="feed-container">

            {
                posts.map((post) => (

                    <div
                        key={post.id}
                        className="post-card"
                    >

                        <h3>
                            {post.titulo}
                        </h3>

                        <small>
                            @{post.creador_nombre}
                        </small>

                        {
                            post.imagen && (

                                <img
                                    src={`http://localhost:3000${post.imagen}`}
                                    alt="post"
                                    className="post-image"
                                />

                            )
                        }

                        <p>
                            {post.contenido}
                        </p>

                    </div>

                ))
            }

        </div>

    );

}

export default Feed;