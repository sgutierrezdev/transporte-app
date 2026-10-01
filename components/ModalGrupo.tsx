"use client";
import { ModalFormularioMaestro, CampoFormulario, estiloInputGlobal } from "./ModalFormularioMaestro";

export function ModalGrupo({ isOpen, onClose, action }: any) {
  return (
    <ModalFormularioMaestro
      isOpen={isOpen}
      onClose={onClose}
      titulo="Registrar nuevo grupo de trabajo"
      etiquetaBoton="Crear grupo de rotación"
      action={action}
    >
      {/* Solo inyectamos el campo que este módulo necesita */}
      <CampoFormulario label="Nombre del grupo / Línea">
        <input 
          name="nombre" 
          required 
          placeholder="Ej. Grupo 1, Línea A, etc." 
          style={estiloInputGlobal} 
        />
      </CampoFormulario>
    </ModalFormularioMaestro>
  );
}
