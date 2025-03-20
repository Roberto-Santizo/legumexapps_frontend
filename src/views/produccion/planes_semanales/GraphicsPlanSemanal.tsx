

const GraphicsPlanSemanal = () => {
  
  const datosPM = {
    'H. Biometrico': 75,
    'H. Plan': 60,
    'H. Linea': 65,
    'H. Rendimiento': 70
  };
  
  // Mejoras para poder asignar colores a cada tipo de dato de forma facil
  const colores = {
    'H. Biometrico': 'bg-orange-500',
    'H. Plan': 'bg-blue-500',
    'H. Linea': 'bg-yellow-400',
    'H. Rendimiento': 'bg-lime-600'
  };
  
  const valorMaximo = Math.max(...(Object.values(datosPM) as number[]));
  
  return (
    <div className="w-4/6 p-6 bg-white rounded-lg shadow-lg mx-auto ">
      <h2 className="text-2xl font-bold text-gray-800 mb-14 text-center">Gráficas de Barras Diarias</h2>
      
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-center mb-4">Insertar algun dato necesario</h3>
          <div className="flex justify-between h-64">
            {(Object.keys(datosPM) as Array<keyof typeof datosPM>).map((tipo, index) => {
              const altura = (datosPM[tipo] / valorMaximo) * 100;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="h-full flex flex-col justify-end">
                    <div 
                      className={`${colores[tipo]} w-16 rounded-t-sm mb-2`}
                      style={{ height: `${altura}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-center">{datosPM[tipo]}</span>
                  <span className="text-xs text-gray-600 mt-1">{tipo}</span>
                </div>
              );
            })}
          </div>
        </div>
      
      <div className="mt-8 flex justify-center gap-6 flex-wrap">
        {(Object.keys(colores) as Array<keyof typeof colores>).map((tipo, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-4 h-4 ${colores[tipo]} mr-2`}></div>
            <span className="text-sm">{tipo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphicsPlanSemanal;