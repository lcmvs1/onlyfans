import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      setUser(JSON.parse(storedUser));

    }

  }, []);

  return (

    <>
      {
        user
          ? (
              <Dashboard
                user={user}
                setUser={setUser}
              />
            )
          : (
              <AuthForm
                setUser={setUser}
              />
            )
      }
    </>

  );

}

export default App;