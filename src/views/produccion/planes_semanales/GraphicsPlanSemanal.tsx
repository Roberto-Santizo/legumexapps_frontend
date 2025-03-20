import { TaskProductionInProgress } from "@/api/WeeklyProductionPlanAPI";

type Props = {
  task: TaskProductionInProgress;
};

const GraphicsPlanSemanal = ({ task }: Props) => {
  const colores = {
    "H. Biometrico": "bg-orange-500",
    "H. Plan": "bg-blue-500",
    "H. Linea": "bg-yellow-400",
    "H. Rendimiento": "bg-lime-600",
  };

  const graphData = {
    "H. Biometrico": task.data.biometric_hours || 0,
    "H. Plan": task.data.total_hours || 0,
    "H. Linea": task.data.line_hours || 0,
    "H. Rendimiento": task.data.performance_hours || 0,
  };
  const valorMaximo = Math.max(...(Object.values(graphData) as number[]));

  return (
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
  );
};

export default GraphicsPlanSemanal;
