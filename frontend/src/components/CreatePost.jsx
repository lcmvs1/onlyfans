import { useState } from "react";
import "../css/App.css";
import axios from "axios";

function CreatePost({ loadPosts }) {

    const [contenido, setContenido] = useState("");
    const [titulo, setTitulo] = useState("");
    const [imagen, setImagen] = useState(null);
    const createPost = async () => {

        if (!titulo || !contenido) return;

        try {

            const token = localStorage.getItem("token");
            const formData = new FormData();

            formData.append("titulo", titulo);

            formData.append("contenido", contenido);
            if (imagen) {
                formData.append("imagen", imagen);
            }
            await axios.post(

                "http://localhost:3000/api/posts/create",

                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }

            );

            await loadPosts();


            setContenido("");
            setTitulo("");
            setImagen(null);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="create-post">

            <input
                type="text"
                placeholder="Título de la publicación"
                value={titulo}
                onChange={(e) =>
                    setTitulo(e.target.value)
                }
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                    setImagen(e.target.files[0])
                }
            />

            <textarea
                placeholder="¿Qué quieres compartir?"
                value={contenido}
                onChange={(e) =>
                    setContenido(e.target.value)
                }
            />

            <button onClick={createPost}>
                Publicar
            </button>

        </div>

    );

}

export default CreatePost;