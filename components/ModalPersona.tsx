"use client";

export function ModalPersonaCompacto({ isOpen, onClose, roles, estados, nombreRol, nombreEstado, action }: any) {
  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 480, background: "var(--bg-tarjeta, #fff)", border: "1px solid var(--border-color, #e2e8f0)", borderRadius: 12, padding: 16, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
        
        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color, #e2e8f0)", paddingBottom: 8, marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Registrar nueva persona</h3>
          <button onClick={onClose} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, border: "1px solid var(--border-color, #ccc)", cursor: "pointer", background: "transparent" }}>Cancelar</button>
        </div>

        {/* Formulario */}
        <form action={(formData) => { action(formData); onClose(); }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          
          <div>
            <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Nombre completo</span>
            <input name="nombre" required style={estiloInput} placeholder="Ej. Juan Pérez Vaca" />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Carnet</span>
              <input name="carnet" style={estiloInput} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Celular</span>
              <input name="celular" style={estiloInput} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Correo (para login)</span>
              <input name="email" type="email" style={estiloInput} placeholder="usuario@correo.com" />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Contraseña</span>
              <input name="password" type="password" style={estiloInput} placeholder="••••••••" />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Rol administrativo</span>
              <select name="rol" defaultValue="SOCIO" style={estiloInput}>
                {roles.map((r: string) => (
                  <option key={r} value={r}>{nombreRol[r]}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Estado inicial</span>
              <select name="estado" defaultValue="ACTIVO" style={estiloInput}>
                {estados.map((e: string) => (
                  <option key={e} value={e}>{nombreEstado[e]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 3 }}>Fecha de ingreso</span>
            <input name="fechaIngreso" type="date" style={estiloInput} />
          </div>

          <button type="submit" style={{ padding: "8px", borderRadius: 6, border: "none", background: "#0070f3", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13, marginTop: 4 }}>
            Registrar persona en el sistema
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
