"use client";
import { useState } from "react";
import { TablaMoviles } from "@/components/TablaMoviles";
import { ModalMovil } from "@/components/ModalMovil";

const datosPrueba = [
  { id: "1", interno: "47", placa: "4521-XYZ", socioNombre: "Juan Pérez Vaca", choferNombre: "Juan Pérez Vaca" },
  { id: "2", interno: "102", placa: "8965-ABC", socioNombre: "Carlos Mendoza", choferNombre: "Luis Fernando Torrico" },
];

export default function MovilesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-4 min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Módulos de Unidades Móviles</h2>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm"
        >
          + Nuevo móvil
        </button>
      </div>

      {/* Renderiza tu tabla compacta con selector */}
      <TablaMoviles datos={datosPrueba} />

      {/* Renderiza tu modal controlado por estado de React */}
      <ModalMovil isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
