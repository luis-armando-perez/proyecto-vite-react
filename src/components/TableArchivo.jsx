import React, { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import appFirebase from "../firebase.config";
import { Timestamp } from "firebase/firestore"; // Importar Timestamp

const db = getFirestore(appFirebase);

export function TableArchivo({ uidUsuario }) {
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (uidUsuario) {
      const subcollectionRef = collection(db, `users/${uidUsuario}/archivos`);
      const unsubscribe = onSnapshot(subcollectionRef, (querySnapshot) => {
        const dataList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDatos(dataList);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [uidUsuario]);

  return (
    <div className="rounded">
      <div className="relative rounded shadow-md">
        {isLoading ? (
          <p className="text-center">Cargando datos...</p>
        ) : (
          <table
            className="w-full h-full text-xs text-left rtl:text-right text-black font-bold"
            style={{ tableLayout: "fixed" }}
          >
            <thead className="text-xs font-bold bg-gray-50 dark:text-gray-400">
              <tr className="font-bold">
                <th scope="col" className="px-2 py-1 text-black">Fecha</th>
                <th scope="col" className="px-2 py-1 text-black">Total Egresos</th>
                <th scope="col" className="px-6 py-1 text-black">Total Ingresos</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              {datos.length > 0 ? (
                datos.map((item) => (
                  <tr key={item.id} className="bg-white dark:border-gray-700 hover:bg-[#E8EAED]">
                    <th scope="row" className="px-2 py-1 font-medium whitespace-nowrap text-black">
                      {item.fecha instanceof Timestamp
                        ? item.fecha.toDate().toLocaleDateString() // Convierte el Timestamp a una fecha legible
                        : new Date(item.fecha).toLocaleDateString()} 
                    </th>
                    <td className="px-6 py-1">{item.totalEgresos}</td>
                    <td className="px-6 py-1">{item.totalIngresos}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
