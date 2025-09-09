import React, { useState } from 'react';
import { 
  initializeMatrix, 
  copyMatrix, 
  luFactorization, 
  pluFactorization, 
  formatNumber 
} from '../utils/matrixUtils';

const LUFactorizationApp = () => {
  const [matrixSize, setMatrixSize] = useState(4);
  const [matrix, setMatrix] = useState(initializeMatrix(4));
  const [usePivoting, setUsePivoting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Generar matriz aleatoria
  const generateRandomMatrix = () => {
    const newMatrix = Array(matrixSize).fill().map(() => 
      Array(matrixSize).fill().map(() => Math.floor(Math.random() * 20) - 10)
    );
    setMatrix(newMatrix);
    setResult(null);
    setError('');
  };

  // Crear matriz vacía para input manual
  const createEmptyMatrix = () => {
    setMatrix(initializeMatrix(matrixSize));
    setResult(null);
    setError('');
  };

  // Actualizar valor de celda
  const updateMatrixValue = (row, col, value) => {
    const newMatrix = copyMatrix(matrix);
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };


  // Resolver factorización
  const solveFactorization = () => {
    if (matrix.length === 0) {
      setError('Por favor genere o ingrese una matriz primero');
      return;
    }

    try {
      setError('');
      
      if (usePivoting) {
        const result = pluFactorization(matrix);
        setResult({
          type: 'PLU',
          ...result
        });
      } else {
        const result = luFactorization(matrix);
        setResult({
          type: 'LU',
          ...result
        });
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  // Renderizar matriz
  const renderMatrix = (mat, title, color = 'blue') => (
    <div className="mb-4">
      <h4 className={`text-lg font-semibold mb-2 text-${color}-600`}>{title}</h4>
      <div className="inline-block border-2 border-gray-300 rounded overflow-auto max-w-full">
        {mat.map((row, i) => (
          <div key={i} className="flex">
            {row.map((val, j) => (
              <div 
                key={j} 
                className="w-14 h-10 flex items-center justify-center border-r border-b border-gray-200 text-xs"
              >
                {formatNumber(val)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Factorización LU y P^TLU
      </h1>

      {/* Controles */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamaño de matriz:
            </label>
            <select 
              value={matrixSize} 
              onChange={(e) => setMatrixSize(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value={4}>4x4</option>
              <option value={5}>5x5</option>
              <option value={6}>6x6</option>
              <option value={7}>7x7</option>
              <option value={8}>8x8</option>
              <option value={9}>9x9</option>
              <option value={10}>10x10</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="pivoting"
              checked={usePivoting}
              onChange={(e) => setUsePivoting(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="pivoting" className="text-sm font-medium text-gray-700">
              Usar P^TLU (con pivoteo)
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateRandomMatrix}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium"
          >
            Generar Matriz Aleatoria
          </button>
          <button
            onClick={createEmptyMatrix}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium"
          >
            Crear Matriz Vacía
          </button>
          <button
            onClick={solveFactorization}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-medium"
            disabled={matrix.length === 0}
          >
            Resolver Factorización
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input de matriz */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Matriz A (Input)</h3>
          {matrix.length > 0 && (
            <div className="inline-block border-2 border-gray-300 rounded">
              {matrix.map((row, i) => (
                <div key={i} className="flex">
                  {row.map((val, j) => (
                    <input
                      key={j}
                      type="number"
                      value={val}
                      onChange={(e) => updateMatrixValue(i, j, e.target.value)}
                      className="w-16 h-12 text-center border-r border-b border-gray-200 text-sm focus:outline-none focus:bg-blue-50"
                      step="0.1"
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resultados */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Resultados - Método {result?.type || (usePivoting ? 'P^TLU' : 'LU')}
          </h3>
          
          {result && (
            <div className="space-y-6">
              {result.type === 'PLU' && (
                <>
                  {renderMatrix(result.PT, 'P^T (Transpuesta de P)', 'red')}
                  {renderMatrix(result.L, 'L (Triangular Inferior)', 'green')}
                  {renderMatrix(result.U, 'U (Triangular Superior)', 'blue')}
                  {result.permutations && result.permutations.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <strong>Intercambios realizados:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {result.permutations.map((swap, i) => (
                          <li key={i}>Fila {swap.from + 1} ↔ Fila {swap.to + 1}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
              
              {result.type === 'LU' && (
                <>
                  {renderMatrix(result.L, 'L (Triangular Inferior)', 'green')}
                  {renderMatrix(result.U, 'U (Triangular Superior)', 'blue')}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Información:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>LU:</strong> Factoriza A = LU sin intercambio de filas</li>
          <li>• <strong>P^TLU:</strong> Factoriza A = P^TLU con pivoteo parcial (intercambio de filas permitido)</li>
          <li>• Si aparece error de elemento diagonal cero, active el checkbox para usar P^TLU</li>
          <li>• L es triangular inferior con 1s en la diagonal</li>
          <li>• U es triangular superior</li>
          <li>• P^T es la transpuesta de la matriz de permutación P</li>
        </ul>
      </div>
    </div>
  );
};

export default LUFactorizationApp;