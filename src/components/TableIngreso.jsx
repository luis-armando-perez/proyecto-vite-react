import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import appFirebase from "../firebase.config";

const db = getFirestore(appFirebase);

export function TableIngreso({ uidUsuario, tipo }) {
  const [datos, setDatos] = useState([]);

  // Calcular el total de ingresos
  const totalIngresos = datos.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    if (uidUsuario && tipo) {
      const subcollectionRef = collection(db, `users/${uidUsuario}/${tipo}`);
      const unsubscribe = onSnapshot(subcollectionRef, (querySnapshot) => {
        const dataList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDatos(dataList);
      });
      return () => unsubscribe();
    }
  }, [uidUsuario, tipo]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${uidUsuario}/${tipo}`, id));
      setDatos(datos.filter((item) => item.id !== id));
    } catch (error) {
    }
  };

  const handleArchive = async () => {
    const fechaArchivar = new Date();

    try {
      // Consultar los ingresos y egresos
      const ingresosSnapshot = await getDocs(
        collection(db, `users/${uidUsuario}/ingresos`)
      );
      const egresosSnapshot = await getDocs(
        collection(db, `users/${uidUsuario}/egresos`)
      );

      // Verificar si hay al menos un dato en cada colección
      if (ingresosSnapshot.empty || egresosSnapshot.empty) {
        alert(
          "Debe ingresar a menos un ingreso y un egreso para archivar."
        );
        return;
      }

      // Calcular los totales
      const totalIngresos = ingresosSnapshot.docs.reduce(
        (acc, doc) => acc + doc.data().cantidad,
        0
      );
      const totalEgresos = egresosSnapshot.docs.reduce(
        (acc, doc) => acc + doc.data().cantidad,
        0
      );

      // Archivar los totales en la colección "archivos"
      await addDoc(collection(db, `users/${uidUsuario}/archivos`), {
        totalIngresos,
        totalEgresos,
        fecha: fechaArchivar,
      });

      // Crear un batch para eliminar documentos de ingresos y egresos
      const batch = writeBatch(db);
      ingresosSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      egresosSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      setDatos([]); // Limpiar los datos después de archivar
    } catch (error) {
    }
  };

  return (
    <div className="rounded overflow-hidden font-semibold h-full flex flex-col">
      <div className="overflow-y-auto flex-grow">
        <table
          className="w-full text-xs text-left rtl:text-right text-black font-bold"
          style={{ tableLayout: "auto" }} // Cambiar a auto para evitar scroll horizontal
        >
          <thead className="text-xs font-semibold bg-gray-50 dark:text-gray-400">
            <tr className="font-bold">
              <th scope="col" className="px-2 py-1 text-black">
                Nombre
              </th>
              <th scope="col" className="px-2 py-1 text-black">
                Descripción
              </th>
              <th scope="col" className="px-6 py-1 text-black">
                Cantidad
              </th>
              <th scope="col" className="px-6 py-1 text-black"></th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {datos.length > 0 ? (
              datos.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white dark:border-gray-700 hover:bg-[#E8EAED]"
                >
                  <th
                    scope="row"
                    className="px-2 py-1 font-medium whitespace-nowrap text-black"
                  >
                    {item.nombre}
                  </th>
                  <td className="px-6 py-1">{item.descripcion}</td>
                  <td className="px-6 py-1">{item.cantidad}</td>
                  <td className="px-6 py-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="bg-[#854DFF] text-white font-bold py-2 px-4 rounded hover:bg-[#CA9EFF] transition duration-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr key="no-data">
                <td colSpan="4" className="text-center">
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="sticky bottom-0 bg-gray-100 pb-6">
        <table className="w-full text-xs text-left rtl:text-right text-black font-bold">
          <tfoot>
            <tr className="font-bold bg-gray-100">
              <td colSpan="2" className="px-2 py-1 text-right">
                Total:
              </td>
              <td className="px-6 py-1 text-black">{totalIngresos}</td>
              <td>
                <button
                  type="button"
                  onClick={handleArchive}
                  className="bg-green-500 relative left-6 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                >
                  Archivar
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
