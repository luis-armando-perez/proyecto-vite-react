import React, { useState } from "react";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import appFirebase from "../firebase.config";

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

export function Modal1({ action, setOpen }) {
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", cantidad: "" });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Debes iniciar sesión para agregar ingresos o egresos.");
        return;
      }

      const userId = user.uid;

      // Referencia al documento del usuario
      const userDocRef = doc(db, "users", userId);

      // Crea el documento si no existe
      await setDoc(userDocRef, { createdAt: new Date() }, { merge: true });

      // Determina la subcolección de destino según la acción (ingreso o egreso)
      const subCollection = action === "ingreso" ? "ingresos" : "egresos";

      // Referencia a la subcolección en el documento del usuario
      const collectionRef = collection(userDocRef, subCollection);

      // Agregar el documento a la subcolección correspondiente
      await addDoc(collectionRef, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        cantidad: parseFloat(formData.cantidad),
        fecha: new Date(),
      });

      console.log(`${action === "ingreso" ? "Ingreso" : "Egreso"} guardado exitosamente`);
      setFormData({ nombre: "", descripcion: "", cantidad: "" });
      setOpen(false);
    } catch (error) {
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
          {action === "ingreso" ? "Agregar Ingreso" : "Agregar Egreso"}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="nombre" className="text-gray-600 font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
              required
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#854EFF]"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="descripcion" className="text-gray-600 font-medium mb-1">
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Ingresa una descripción"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#854EFF]"
            />
          </div>
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
            Guardar {action === "ingreso" ? "Ingreso" : "Egreso"}
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
