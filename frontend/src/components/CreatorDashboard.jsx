import { useEffect, useState } from "react";

import axios from "axios";

import "../css/App.css";

import CreatePost from "./CreatePost";
import PostList from "./PostList";

function CreatorDashboard({ user, setUser }) {

    const [posts, setPosts] = useState([]);

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

    };

    const loadPosts = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(

                `http://localhost:3000/api/posts?creadorId=${user.id}`,

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

    useEffect(() => {

        const fetchPosts = async () => {

            await loadPosts();

        };

        fetchPosts();

    }, []);

    return (

        <div className="dashboard">

            <h1>
                Bienvenido creador
            </h1>

            <h2>
                {user.nombre}
            </h2>

            <CreatePost
                posts={posts}
                setPosts={setPosts}
            />

            <PostList posts={posts} />

            <button
                className="logout-btn"
                onClick={logout}
            >
                Cerrar sesión
            </button>

        </div>

    );

}

export default CreatorDashboard;