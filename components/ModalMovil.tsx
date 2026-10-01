"use client";

export function ModalMovilCompacto({ isOpen, onClose, subgrupos, personas, action }: any) {
  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 460, background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: 12, padding: 16, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
        
        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color, #e2e8f0)", paddingBottom: 8, marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Registrar nuevo móvil</h3>
          <button onClick={onClose} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, border: "1px solid var(--border-color, #ccc)", cursor: "pointer", background: "transparent" }}>Cancelar</button>
        </div>

        {/* Formulario */}
        <form action={(formData) => { action(formData); onClose(); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          
          {/* Fila Dual 1 */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Número de interno</span>
              <input name="numeroInterno" required style={estiloInput} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Placa</span>
              <input name="placa" style={estiloInput} />
            </div>
          </div>

          {/* Fila Dual 2 */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Capacidad</span>
              <input name="capacidad" type="number" style={estiloInput} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Subgrupo</span>
              <select name="subgrupoId" defaultValue="" style={estiloInput}>
                <option value="">Sin asignar</option>
                {subgrupos.map((s: any) => (
                  <option key={s.id} value={s.id}>Grupo {s.grupo.nombre} - {s.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila Dual 3 */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Socio dueño</span>
              <select name="socioId" defaultValue="" style={estiloInput}>
                <option value="">Sin asignar</option>
                {personas.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Chofer titular</span>
              <select name="choferTitularId" defaultValue="" style={estiloInput}>
                <option value="">Sin asignar</option>
                {personas.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" style={{ padding: "8px", borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13, marginTop: 4 }}>
            Registrar móvil en flota
          </button>
        </form>
      </div>
    </div>
  );
}

const estiloInput = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid var(--border-color, #d9deee)",
  fontSize: 13,
  background: "var(--bg-input, #fff)",
  color: "var(--texto-principal, #000)"
};
