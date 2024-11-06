import React, { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import appFirebase from "../firebase.config";

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

export function Presupuesto({ setOpen, onPresupuestoAdded }) {
  const [formData, setFormData] = useState({ cantidad: "" });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const users = auth.currentUser;
      if (!users) {
        alert("Debes iniciar sesión para agregar un presupuesto.");
        return;
      }
      const userId = users.uid;
      // Referencia al documento del usuario en la colección "usuarios"
      const userDocRef = doc(db, "users", userId);
      // Crea o actualiza el documento del presupuesto
      await setDoc(userDocRef, { createdAt: new Date() }, { merge: true });
      // Referencia a la subcolección "presupuestos" en el documento del usuario
      const presupuestoDocRef = doc(db, `users/${userId}/presupuestos/presupuesto`);
      // Guardar el presupuesto
      await setDoc(presupuestoDocRef, {
        cantidad: parseFloat(formData.cantidad), // Convertir la cantidad a número
        fecha: new Date(),
      });
      console.log("Presupuesto guardado exitosamente");
      setFormData({ cantidad: "" }); // Resetear el formulario
      onPresupuestoAdded(); // Llama a la función para actualizar la lista
      setOpen(false); // Cerrar el modal
    } catch (error) {
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
          Agregar Presupuesto
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="cantidad" className="text-gray-600 font-medium mb-1">
              Cantidad
            </label>
            <input
              type="number"
              id="cantidad"
              value={formData.cantidad}
              onChange={handleInputChange}
              placeholder="Ingresa el Monto en Nº"
              required
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#854EFF]"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-[#854DFF] py-2 px-6 rounded text-white font-bold hover:bg-[#CA9EFF] transition duration-200"
          >
            Guardar Presupuesto
          </button>
        </form>
        <button
          className="mt-6 bg-red-500 py-2 px-6 rounded text-white font-bold hover:bg-red-600 transition duration-200"
          onClick={() => setOpen(false)}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
