import { useState, useEffect } from "react";
import { Modal1 } from "./Modal1";
import { Presupuesto } from "./Presupuesto";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import appFirebase from "../firebase.config";
import { motion } from "framer-motion";

const auth = getAuth(appFirebase);

const SliderBar = ({ correoUsuario }) => {
  const [open, setOpen] = useState(true);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false); // Estado para el modal de presupuesto
  const [uid, setUid] = useState(null); // Estado para almacenar el UID

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid); // Obtener el UID del usuario autenticado
      } else {
        setUid(null); // No hay usuario autenticado
      }
    });

    return () => unsubscribe(); // Limpiar el listener
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada correctamente");
    } catch (error) {
    }
  };

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } bg-white h-screen p-5 pt-8 relative duration-300`}
      >
        <div className="flex gap-x-4 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          <h1 className="text-black origin-left font-bold text-xl">
            {correoUsuario}
          </h1>
        </div>

        {/* Iconos */}
        <ul className="pt-6 flex flex-col justify-between h-full">
          <div>
            <li className="flex items-center p-2 hover:bg-[#F3F4F6] cursor-pointer mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />
              </svg>
              <span className="text-black ml-4 font-bold">Dashboard</span>
            </li>

            {/* Opción para agregar ingreso */}
            <li
              className="flex items-center p-2 hover:bg-[#F3F4F6] cursor-pointer mb-2"
              onClick={() => setShowIncomeModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              {open && (
                <span className="ml-4 text-black font-bold">
                  Agregar Ingreso
                </span>
              )}
            </li>

            {/* Opción para agregar egreso */}
            <li
              className="flex items-center p-2 hover:bg-[#F3F4F6] cursor-pointer mb-2"
              onClick={() => setShowExpenseModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14"
                />
              </svg>
              {open && (
                <span className="ml-4 text-black font-bold">
                  Agregar Egreso
                </span>
              )}
            </li>

            {/* Opción para agregar presupuesto */}
            <li
              className="flex items-center p-2 hover:bg-[#F3F4F6] cursor-pointer mb-2"
              onClick={() => setShowBudgetModal(true)} // Abre el modal de presupuesto
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                />
              </svg>

              {open && (
                <span className="ml-4 font-bold">Agregar Presupuesto</span>
              )}
            </li>
          </div>

          {/* Opción para salir */}
          <li className="flex items-center mb-14 p-2 hover:bg-[#F3F4F6] cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
            {open && (
              <motion.button
              onClick={handleLogout}
              className="ml-4 bg-[#ff8066] text-white font-bold py-1 px-2 rounded hover:bg-red-600 transition duration-200"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }} // Animación de salida
              transition={{ duration: 0.5 }}
            >
              Salir
            </motion.button>
            )}
          </li>
        </ul>

        {/* Modales para ingreso, egreso y presupuesto */}
        {showBudgetModal && uid && (
          <Presupuesto
            setOpen={setShowBudgetModal}
            action="presupuesto"
            uid={uid}
          />
        )}
        {showIncomeModal && uid && (
          <Modal1 setOpen={setShowIncomeModal} action="ingreso" uid={uid} />
        )}
        {showExpenseModal && uid && (
          <Modal1 setOpen={setShowExpenseModal} action="egreso" uid={uid} />
        )}
      </div>
    </div>
  );
};

export default SliderBar;
