function PostList({ posts }) {

    return (

        <div className="post-list">

            {
                posts.map((post) => (

                    <div
                        key={post.id}
                        className="post-card"
                    >

                        <h3>
                            {post.titulo}
                        </h3>

                        post.imagen && (

                        <img
                            src={`http://localhost:3000${post.imagen}`}
                            alt="post"
                            className="post-image"
                        />

                        )

                        <p>
                            {post.contenido}
                        </p>

                    </div>

                ))
            }

        </div>

    );

}

export default PostList;