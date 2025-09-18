// Inicializar matriz vacía
export const initializeMatrix = (size) => {
  return Array(size).fill().map(() => Array(size).fill(0));
};

// Crear matriz identidad
export const createIdentityMatrix = (size) => {
  return Array(size).fill().map((_, i) => 
    Array(size).fill().map((_, j) => i === j ? 1 : 0)
  );
};

// Copiar matriz
export const copyMatrix = (mat) => mat.map(row => [...row]);

// Intercambiar filas
export const swapRows = (mat, row1, row2) => {
  [mat[row1], mat[row2]] = [mat[row2], mat[row1]];
};

// Factorización LU sin pivoteo
export const luFactorization = (A) => {
  const n = A.length;
  const U = copyMatrix(A); // -> crea una copia de la matriz original
  const L = createIdentityMatrix(n); // -> crea una matriz identidad de tamaño n

  // Verificacion para que no sea muy pequeño el pivote
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(U[i][i]) < 1e-10) {
      throw new Error(`Elemento diagonal cero en posición (${i+1},${i+1}). Use el método P^TLU.`);
    }

    // 
    for (let j = i + 1; j < n; j++) {
      const factor = U[j][i] / U[i][i];
      L[j][i] = factor;
      
      for (let k = i; k < n; k++) {
        U[j][k] -= factor * U[i][k]; // -> restamos la fila pivote multiplicada por el factor para anular la posición
        // -> seria como: Fila x = Fila x - factor * Fila y 
        // Que es igual a... (-factor * Fila y) + Fila x => Fila x
      }
    }
  }

  return { L, U };
};

// Factorización P^TLU con pivoteo
export const pluFactorization = (A) => {
  const n = A.length;
  const U = copyMatrix(A); // -> copia de la original
  const L = createIdentityMatrix(n); // -> crea una matriz identidad de tamaño n
  const P = createIdentityMatrix(n); // -> crea una matriz identidad de tamaño n
  const permutations = []; // -> se guardaran todas las permutaciones (cambios de filas) hechas

  for (let i = 0; i < n - 1; i++) {
    // Encontrar el pivote (elemento de mayor valor absoluto)
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(U[k][i]) > Math.abs(U[maxRow][i])) {
        maxRow = k;
      }
    }

    // Intercambiar filas si es necesario
    if (maxRow !== i) { // -> si maxRow es diferente a i, significa que hay que intercambiar filas
      swapRows(U, i, maxRow); // -> intercambia las filas en U
      swapRows(P, i, maxRow); // -> intercambia las filas en P
      permutations.push({ from: i, to: maxRow }); // -> registra la permutación
    }

    // Verificacion para que no sea muy pequeño el pivote
    if (Math.abs(U[i][i]) < 1e-10) {
      throw new Error(`Matriz singular en posición (${i+1},${i+1})`);
    }

    // Aplicar el mismo reemplazo de valores que en LU
    for (let j = i + 1; j < n; j++) {
      const factor = U[j][i] / U[i][i];
      L[j][i] = factor;
      
      for (let k = i; k < n; k++) {
        U[j][k] -= factor * U[i][k];
      }
    }
  }

  // Calcular P^T (transpuesta de P)
  const PT = Array(n).fill().map((_, i) => 
    Array(n).fill().map((_, j) => P[j][i])
  );

  return { PT, L, U, P, permutations };
};

// Formatear número para mostrar
export const formatNumber = (num) => {
  if (Math.abs(num) < 1e-10) return '0';
  return Math.abs(num - Math.round(num)) < 1e-10 ? Math.round(num).toString() : num.toFixed(3);
};
