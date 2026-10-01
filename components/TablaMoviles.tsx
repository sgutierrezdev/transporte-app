"use client";
import { useState } from "react";

export function TablaMoviles({ datos }: { datos: any[] }) {
  const [enfoque, setEnfoque] = useState<"socio" | "chofer">("socio");

  return (
    <div className="w-full">
      {/* Selector de Pestañas Compacto */}
      <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-800 border mb-4">
        <button 
          onClick={() => setEnfoque("socio")}
          className={`px-3 py-1 text-xs font-bold rounded-md ${enfoque === "socio" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow" : "text-slate-500"}`}
        >
          Ver Socios (Dueños)
        </button>
        <button 
          onClick={() => setEnfoque("chofer")}
          className={`px-3 py-1 text-xs font-bold rounded-md ${enfoque === "chofer" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow" : "text-slate-500"}`}
        >
          Ver Choferes
        </button>
      </div>

      {/* Estructura Densa Neutra */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs font-bold uppercase border-b dark:border-slate-800">
              <th className="p-3 text-center w-16">Int.</th>
              <th className="p-3 w-24">Placa</th>
              <th className="p-3">Personal de la Unidad</th>
              <th className="p-3 text-right pr-6 w-20">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {datos.map((m) => (
              <tr key={m.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 relative">
                <td className="p-3 text-center font-black">{m.interno}</td>
                <td className="p-3 font-mono text-xs text-slate-400">{m.placa}</td>
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-semibold">{enfoque === "socio" ? m.socioNombre : m.choferNombre}</span>
                    {m.socioNombre !== m.choferNombre && (
                      <span className="text-xs text-slate-400 mt-0.5">
                        {enfoque === "socio" ? `Chofer: ${m.choferNombre}` : `Dueño: ${m.socioNombre}`}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right pr-6">
                  <div className="opacity-0 group-hover:opacity-100 inline-flex gap-2 bg-white dark:bg-slate-900 shadow rounded px-1">
                    <button className="text-slate-400 hover:text-slate-600 text-xs">✏️</button>
                    <button className="text-slate-400 hover:text-red-500 text-xs">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
