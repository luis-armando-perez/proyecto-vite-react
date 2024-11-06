import React, { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import appFirebase from "../firebase.config";

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

export function TablePresu() {
  const [presupuestos, setPresupuestos] = useState([]);

  useEffect(() => {
    const fetchPresupuestos = () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("Debes iniciar sesión para ver los presupuestos.");
        return;
      }
      const userId = user.uid;
      const presupuestoCollectionRef = collection(db, `users/${userId}/presupuestos`);

      // Usar onSnapshot para actualizar los datos en tiempo real
      const unsubscribe = onSnapshot(presupuestoCollectionRef, (snapshot) => {
        const presupuestosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPresupuestos(presupuestosData);
      });

      // Retornar la función de desuscripción para limpiar el listener
      return unsubscribe;
    };

    const unsubscribe = fetchPresupuestos();

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <div className="overflow-hidden">
      {presupuestos.length === 0 ? (
        <p>No hay presupuestos guardados.</p>
      ) : (
        presupuestos.map((presupuesto) => (
          <div key={presupuesto.id} className="block max-w-sm p-6 bg-[#c4fcef]  rounded-lg shadow mb-4">
            <p className="font-semibold text-gray-700">Cantidad: {presupuesto.cantidad}</p>
          </div>
        ))
      )}
    </div>
  );
}
