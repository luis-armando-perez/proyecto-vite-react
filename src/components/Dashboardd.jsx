import React from "react";
import { TableIngreso } from "./TableIngreso";
import SliderBar from "./SliderBar";
import { BarChart } from "./Barra";
import { TableArchivo } from "./TableArchivo";
import { TablePresu } from "./TablePresu";
import { Presupuesto } from "./Presupuesto";
import { motion } from "framer-motion";

export function Dashboardd({ correoUsuario, uidUsuario }) {
  // Define las variantes de animación para diferentes direcciones
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1 },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1 },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1 },
  };

  return (
    <div className="h-screen bg-[#DEDEE0] grid grid-cols-4 grid-rows-3 gap-6">
      {/* SliderBar: aparece desde la izquierda */}
      <motion.div
        className="overflow-hidden text bg-center rounded-lg row-span-3 relative z-50"
        initial="initial"
        animate="animate"
        variants={fadeInLeft} // Animación desde la izquierda
      >
        <SliderBar correoUsuario={correoUsuario} uidUsuario={uidUsuario} />
      </motion.div>

      <div className="p-2 col-span-3 row-span-3">
        <div className="h-screen grid grid-cols-5 grid-rows-5 gap-3">
          {/* Presupuesto: aparece desde abajo */}
          <motion.div
            className="overflow-hidden rounded-lg text-center bg-[#00c9a7] row-span-2"
            initial="initial"
            animate="animate"
            variants={fadeInUp} // Animación desde abajo
          >
            <h1 className="font-bold">Presupuesto</h1>
            <div className="w-full h-full flex justify-center">
              <TablePresu />
            </div>
          </motion.div>

          {/* Ingresos: aparece desde la derecha */}
          <motion.div
            className="overflow-hidden rounded-lg text-center bg-[#dcf5ff] row-span-2 col-span-2"
            initial="initial"
            animate="animate"
            variants={fadeInRight} // Animación desde la derecha
          >
            <h1 className="font-bold">Ingresos</h1>
            <div className="w-full h-full flex justify-center">
              <TableIngreso tipo="ingresos" uidUsuario={uidUsuario} />
            </div>
          </motion.div>

          {/* Egresos: aparece desde la izquierda */}
          <motion.div
            className="overflow-hidden rounded-lg text-center bg-[#dcf5ff] row-span-2 col-span-2"
            initial="initial"
            animate="animate"
            variants={fadeInLeft} // Animación desde la izquierda
          >
            <h1>Egresos</h1>
            <div className="w-full h-full flex justify-center">
              <TableIngreso tipo="egresos" uidUsuario={uidUsuario} />
            </div>
          </motion.div>

          {/* Archivo: aparece desde abajo */}
          <motion.div
            className="overflow-hidden rounded-lg text-center bg-[#dcf5ff] row-span-2 col-span-2"
            initial="initial"
            animate="animate"
            variants={fadeInUp} // Animación desde abajo
          >
            <h1>Archivo</h1>
            <div className="w-full h-full flex justify-center">
              <TableArchivo uidUsuario={uidUsuario} />
            </div>
          </motion.div>

          {/* Gráfico de ingresos: aparece desde abajo */}
          <motion.div
            className="overflow-hidden rounded-lg text-center bg-gradient-to-t from-slate-50 to-violet-300 row-span-3 col-span-3"
            initial="initial"
            animate="animate"
            variants={fadeInUp} // Animación desde abajo
          >
            <h1 className="font-bold">Gráfico de Ingresos</h1>
            <div className="w-full h-full flex justify-center">
              <BarChart uidUsuario={uidUsuario} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
