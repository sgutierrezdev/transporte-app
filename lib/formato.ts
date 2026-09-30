export function bs(n: number) {
  return `Bs ${n.toFixed(2)}`;
}

export function numeroComprobante(n: number) {
  return String(n).padStart(6, "0");
}

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
  const partes: string[] = [];
  const c = Math.floor(n / 100);
  const resto = n % 100;
  if (c > 0) partes.push(CENTENAS[c]);
  if (resto > 0) {
    if (resto < 30) {
      partes.push(UNIDADES[resto]);
    } else {
      const d = Math.floor(resto / 10);
      const u = resto % 10;
      partes.push(u === 0 ? DECENAS[d] : `${DECENAS[d]} y ${UNIDADES[u]}`);
    }
  }
  return partes.join(" ");
}

// "uno" pasa a "un" cuando va delante de "mil" o "millón(es)".
function apocope(texto: string) {
  return texto.replace(/veintiuno$/, "veintiún").replace(/uno$/, "un");
}

function enteroEnLetras(n: number): string {
  if (n === 0) return "cero";
  const millones = Math.floor(n / 1_000_000);
  const miles = Math.floor((n % 1_000_000) / 1000);
  const resto = n % 1000;
  const partes: string[] = [];
  if (millones > 0) {
    partes.push(millones === 1 ? "un millón" : `${apocope(menorDeMil(millones))} millones`);
  }
  if (miles > 0) {
    partes.push(miles === 1 ? "mil" : `${apocope(menorDeMil(miles))} mil`);
  }
  if (resto > 0) partes.push(menorDeMil(resto));
  return partes.join(" ");
}

/** 1250.5 -> "MIL DOSCIENTOS CINCUENTA 50/100 BOLIVIANOS" */
export function montoEnLetras(monto: number): string {
  const entero = Math.floor(monto);
  const centavos = Math.round((monto - entero) * 100);
  const texto = enteroEnLetras(entero).toUpperCase();
  return `${texto} ${String(centavos).padStart(2, "0")}/100 BOLIVIANOS`;
}
