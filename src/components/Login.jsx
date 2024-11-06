import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import appFirebase from "../firebase.config";
import { motion } from "framer-motion";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrando, setRegistrando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registrando) {
      // Verificar la longitud de la contraseña
      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return; // Salir de la función si la contraseña es demasiado corta
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { email: user.email });
        await setDoc(doc(collection(userDocRef, "ingresos")), {});
        await setDoc(doc(collection(userDocRef, "egresos")), {});

        await signOut(auth);
        alert("Usuario registrado. Por favor, inicia sesión.");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          alert("Este correo electrónico ya está registrado. Por favor, usa otro.");
        } else {
          alert("Error al registrar el usuario. Intenta nuevamente.");
        }
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        alert("Error al iniciar sesión. Verifica tus credenciales.");
      }
    }
  };

  // Definir la animación de entrada
  const slideInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: "easeOut" },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07244C]">
      <motion.div
        className="bg-[#E5EAF3] w-96 p-6 rounded-lg shadow-md"
        initial="initial"
        animate="animate"
        variants={slideInUp} // Aplicar la animación de entrada
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          {registrando ? "Registro" : "Inicio de sesión"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 bg-[#D9D9D9] border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full p-2 bg-[#D9D9D9] border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-[#7671FA] text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            {registrando ? "Regístrate" : "Iniciar sesión"}
          </button>
        </form>

        <span className="block text-center text-sm text-gray-600 mt-4">
          {registrando ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
          <button
            onClick={() => setRegistrando(!registrando)}
            className="text-blue-600 hover:underline ml-2"
          >
            {registrando ? "Inicia sesión" : "Regístrate"}
          </button>
        </span>
      </motion.div>
    </div>
  );
}
