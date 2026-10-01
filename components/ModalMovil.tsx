"use client";

export function ModalMovil({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex justify-between items-center border-b dark:border-slate-800 pb-2 mb-4">
          <h3 className="text-sm font-bold">Registrar nuevo móvil</h3>
          <button onClick={onClose} className="text-xs border dark:border-slate-700 px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800">Cancelar</button>
        </div>
        <form className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Interno</label>
              <input type="text" required placeholder="Ej. 47" className="w-full text-sm bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-700 rounded p-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Placa</label>
              <input type="text" required placeholder="Ej. 4521-XYZ" className="w-full text-sm bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-700 rounded p-2 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Propietario</label>
            <input type="text" required placeholder="Nombre del dueño" className="w-full text-sm bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-700 rounded p-2 focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded mt-2 shadow-sm">Registrar en Flota</button>
        </form>
      </div>
    </div>
  );
}
