const UNIDADES = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete",
  "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés",
  "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];
const DECENAS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CENTENAS = [
  "", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos",
  "seiscientos", "setecientos", "ochocientos", "novecientos",
];

function menorDeMil(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cien";
  const c = Math.floor(n / 100);
  const r = n % 100;
  const partes: string[] = [];
  if (c) partes.push(CENTENAS[c]);
  if (r) {
    if (r < 30) {
      partes.push(UNIDADES[r]);
    } else {
      const d = Math.floor(r / 10);
      const u = r % 10;
      partes.push(u ? `${DECENAS[d]} y ${UNIDADES[u]}` : DECENAS[d]);
    }
  }
  return partes.join(" ");
}

// "uno" -> "un" y "veintiuno" -> "veintiún" cuando va antes de "mil" o "millones"
function apocope(texto: string): string {
  if (texto.endsWith("veintiuno")) return texto.slice(0, -9) + "veintiún";
  if (texto.endsWith("uno")) return texto.slice(0, -3) + "un";
  return texto;
}

function enteroALetras(n: number): string {
  if (n === 0) return "cero";
  const millones = Math.floor(n / 1_000_000);
  const miles = Math.floor((n % 1_000_000) / 1000);
  const resto = n % 1000;
  const partes: string[] = [];
  if (millones) {
    partes.push(millones === 1 ? "un millón" : `${apocope(enteroALetras(millones))} millones`);
  }
  if (miles) {
    partes.push(miles === 1 ? "mil" : `${apocope(menorDeMil(miles))} mil`);
  }
  if (resto) partes.push(menorDeMil(resto));
  return partes.join(" ");
}

/** Ej.: 1250.5 -> "Mil doscientos cincuenta con 50/100 bolivianos" */
export function montoEnLetras(monto: number): string {
  const centavosTotales = Math.round(monto * 100);
  const entero = Math.floor(centavosTotales / 100);
  const centavos = centavosTotales % 100;
  const letras = enteroALetras(entero);
  const capitalizado = letras.charAt(0).toUpperCase() + letras.slice(1);
  return `${capitalizado} con ${String(centavos).padStart(2, "0")}/100 bolivianos`;
}
