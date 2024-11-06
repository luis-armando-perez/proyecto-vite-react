import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import appFirebase from "../firebase.config";
import { Timestamp } from "firebase/firestore";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const db = getFirestore(appFirebase);

export function BarChart({ uidUsuario }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Ingresos",
        backgroundColor: "#845ec2",
        data: []
      },
      {
        label: "Egresos",
        backgroundColor: "#ff8066",
        data: []
      }
    ]
  });

  useEffect(() => {
    if (uidUsuario) {
      const archivosRef = collection(db, `users/${uidUsuario}/archivos`);

      const unsubscribe = onSnapshot(archivosRef, (snapshot) => {
        const fechas = [];
        const ingresosData = [];
        const egresosData = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const fecha = data.fecha instanceof Timestamp
            ? data.fecha.toDate().toLocaleDateString()
            : new Date(data.fecha).toLocaleDateString();

          fechas.push(fecha);
          ingresosData.push(data.totalIngresos || 0);
          egresosData.push(data.totalEgresos || 0);
        });

        setChartData({
          labels: fechas,
          datasets: [
            { ...chartData.datasets[0], data: ingresosData },
            { ...chartData.datasets[1], data: egresosData }
          ]
        });
      });

      return () => unsubscribe();
    }
  }, [uidUsuario]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-2/3 max-w-md h-64">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }}
        />
      </div>
    </div>
  );
}
