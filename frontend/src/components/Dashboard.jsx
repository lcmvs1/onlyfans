import CreatorDashboard from "./CreatorDashboard";
import FollowerDashboard from "./FollowerDashboard";

function Dashboard({ user, setUser }) {

    return (

        <>
            {
                user.rol === "creador"
                    ? (
                        <CreatorDashboard
                            user={user}
                            setUser={setUser}
                        />
                    )
                    : (
                        <FollowerDashboard
                            user={user}
                            setUser={setUser}
                        />
                    )
            }
        </>

    );

}

export default Dashboard;