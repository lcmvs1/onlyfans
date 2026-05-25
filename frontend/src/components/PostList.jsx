import defaultProfile from "../assets/user.png";

function PostList({ posts }) {

    return (

        <div className="post-list">

            {
                posts.map((post) => (

                    <div
                        key={post.id}
                        className="post-card"
                    >

                        <div className="post-header">

                            <div className="post-avatar">

                                <img
                                    src={
                                        post.creador_foto
                                            ? `http://localhost:3000${post.creador_foto}`
                                            : defaultProfile
                                    }
                                />

                            </div>

                            <div className="post-user-info">

                                <h3 className="post-user">

                                    {post.creador_nombre}

                                </h3>

                                <small className="post-date">

                                    @{post.creador_nombre}Official
                                </small>

                            </div>

                        </div>

                        <h2 className="post-title">
                            {post.titulo}
                        </h2>
                        {

                            post.imagen && (

                                <img
                                    src={`http://localhost:3000${post.imagen}`}
                                    alt="post"
                                    className="post-image"
                                />

                            )
                        }

                        <p className="post-content">
                            {post.contenido}
                        </p>
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

                ))
            }

        </div>

    );

}

export default PostList;