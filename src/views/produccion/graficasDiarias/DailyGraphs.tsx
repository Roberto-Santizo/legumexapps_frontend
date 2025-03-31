import React from "react";

const DailyGraphs: React.FC = () => {
  const colores = {
    "H. Biometrico": "bg-orange-500",
    "H. Plan": "bg-blue-500",
    "H. Linea": "bg-yellow-400",
    "H. Rendimiento": "bg-lime-600",
  };

  const graphData = {
    "H. Biometrico": 52,
    "H. Plan": 30,
    "H. Linea": 23,
    "H. Rendimiento": 80,
  };

  const valorMaximo = Math.max(...(Object.values(graphData) as number[]));

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-8">Gráficas Diarias</h1>
      
      <div className="flex justify-center mb-6 ">
        <input
          type="date"
          className="p-2 border border-gray-300 rounded-lg mr-4 w-1/6"
        />
        <select className="p-2 border border-gray-300 rounded-lg mr-4 bg-white w-1/6">
          <option value="Option1">Option1</option>
          <option value="Option2">Option2</option>
          <option value="Pastel3">Pastel3</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-40">
          Buscar
        </button>
      </div>

      <div className="w-4/6 p-6 bg-white rounded-lg shadow-lg mx-auto ">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between h-64 bg-gray-50 p-4 rounded-lg">
            {(Object.keys(graphData) as Array<keyof typeof graphData>).map(
              (tipo, index) => {
                const altura = (graphData[tipo] / valorMaximo) * 100;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="h-full flex flex-col justify-end">
                      <div
                        className={`${colores[tipo]} w-16 rounded-t-sm mb-2`}
                        style={{ height: `${altura}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-center">
                      {graphData[tipo]}
                    </span>
                    <span className="text-xs text-gray-600 mt-1">{tipo}</span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          {(Object.keys(colores) as Array<keyof typeof colores>).map(
            (tipo, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 ${colores[tipo]} mr-2`}></div>
                <span className="text-sm">{tipo}</span>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};
export default DailyGraphs;
