// Inicializar matriz vacía
export const initializeMatrix = (size) => {
  return new Array(size).fill().map(() => new Array(size).fill(0));
};

// Crear matriz identidad
export const createIdentityMatrix = (size) => {
  return new Array(size).fill().map((_, i) => 
    new Array(size).fill().map((_, j) => i === j ? 1 : 0)
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

export function needsPivoting(matrix, wall = 1e-10) { // -> wall es el parametro a comparar
  const n = matrix.length;
  const A = copyMatrix(matrix);

  for (let k = 0; k < n; k++) {
    // Verificamos un pivot e en la diagonal de la matriz
    if (Math.abs(A[k][k]) < wall) {
      return true;
    }

    // Eliminar hacia abajo (simulación)
    for (let i = k + 1; i < n; i++) {
      const factor = A[i][k] / A[k][k];
      for (let j = k; j < n; j++) {
        A[i][j] -= factor * A[k][j];
      }
    }
  }

  return false; // -> no hay ningun pivtoe como 0
}

// Factorización P^TLU con pivoteo
export const pluFactorization = (A) => {
  const n = A.length;
  const U = copyMatrix(A); // -> crea una copia de la matriz original
  const L = createIdentityMatrix(n); // -> matriz identidad
  const P = createIdentityMatrix(n); // -> matriz de permutación (a partir de la identidad)
  const permutations = [];

  for (let i = 0; i < n - 1; i++) {
    // Encontrar el pivote (elemento de mayor valor absoluto)
    let maxRow = i;
    let maxVal = Math.abs(U[i][i]);
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(U[k][i]) > maxVal) {
        maxVal = Math.abs(U[k][i]);
        maxRow = k;
      }
    }

    if (maxVal < 1e-10) continue;

    // Intercambiar filas si es necesario
    if (maxRow !== i) {
      swapRows(U, i, maxRow);
      swapRows(P, i, maxRow);
      
      // Solo intercambiar las columnas ya calculadas de L (a la izquierda de la diagonal)
      for (let k = 0; k < i; k++) {
        const temp = L[i][k];
        L[i][k] = L[maxRow][k];
        L[maxRow][k] = temp;
      }
      
      permutations.push({ from: i, to: maxRow });
    }

    // Aplicar eliminación gaussiana
    for (let j = i + 1; j < n; j++) {
      const factor = U[j][i] / U[i][i];
      L[j][i] = factor;
      
      for (let k = i; k < n; k++) {
        U[j][k] -= factor * U[i][k];
      }
    }
  }

  // Calcular P^T (transpuesta de P)
  const PT = new Array(n).fill().map((_, i) => 
    new Array(n).fill().map((_, j) => P[j][i])
  );

  return { PT, L, U, P, permutations };
};

// Formatear número para mostrar
export const formatNumber = (num) => {
  if (Math.abs(num) < 1e-10) return '0';
  return Math.abs(num - Math.round(num)) < 1e-10 ? Math.round(num).toString() : num.toFixed(3);
};
