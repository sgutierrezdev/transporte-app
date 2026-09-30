export const NOMBRE_ROL: Record<string, string> = {
  ADMIN: "Administración",
  JEFE_GRUPO: "Jefe de línea",
  SECRETARIA: "Secretaria",
  SOCIO: "Socio (dueño)",
  CHOFER: "Chofer contratado",
};

export const ROLES = ["ADMIN", "JEFE_GRUPO", "SECRETARIA", "SOCIO", "CHOFER"] as const;

export const ESTADOS_PERSONA = ["ACTIVO", "INACTIVO", "LICENCIA"] as const;

export const NOMBRE_ESTADO: Record<string, string> = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
  LICENCIA: "Licencia",
};
export const ESTADOS_SOCIO = {
  ACTIVO: "ACTIVO",
  INACTIVO: "INACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
  LICENCIA: "LICENCIA"
};
