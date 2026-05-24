import "../css/App.css";

import Feed from "./Feed";

function FollowerDashboard({ user, setUser }) {

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

    };

    return (

        <div className="dashboard">

            <h1>
                Bienvenido seguidor
            </h1>

            <h2>
                {user.nombre}
            </h2>

            <Feed />

            <button
                className="logout-btn"
                onClick={logout}
            >
                Cerrar sesión
            </button>

        </div>

    );

}

export default FollowerDashboard;