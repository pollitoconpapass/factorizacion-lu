// Vamos a pasar las matrices a Latex para luego ser consultadas en SymboLab, 
// verificando que la respuesta sea correcta
import { formatNumber } from "./matrixUtils";

export const getSymbolabURL = (matrices, lang = "es") => {
  const latexParts = matrices.map(matrix => {
    const rows = matrix
      .map(row => row.map(v => formatNumber(v)).join("&")) // -> une columnas con "&"
      .join("\\\\"); // ->  une filas con "\\"
    return `\\begin{pmatrix}${rows}\\end{pmatrix}`;
  });

  // Combinar las matrices con el símbolo de multiplicación
  const latexExpression = latexParts.join("\\cdot");

  // Encodear la expresión en LaTeX para la URL
  const encoded = encodeURIComponent(latexExpression);

  // Construir la URL completa
  return `https://${lang}.symbolab.com/solver/step-by-step/${encoded}?or=input`;
};