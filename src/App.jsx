import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Dashboardd } from './components/Dashboardd'
import { Login } from "./components/Login";
import appFirebase from "./firebase.config";

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
      } else {
        setUsuario(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {usuario ? (
        <Dashboardd correoUsuario={usuario.email} uidUsuario={usuario.uid} />
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
