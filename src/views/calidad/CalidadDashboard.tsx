import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQueries } from '@tanstack/react-query';
import { getReceptionsByPercentageDiference, getReceptionsPendingQualityTest, ReceptionByPercentage } from '@/api/DashboardCalidadAPI';
import Spinner from '@/components/utilities-components/Spinner';


const CalidadDashboard: React.FC = () => {

  const [totalBoletas, setTotalBoletas] = useState<number>(0);
  const [receptionHistorics,setReceptionHistorics] = useState<ReceptionByPercentage[]>([]);

  const results = useQueries({
    queries: [
      { queryKey: ['getReceptionsPendingQualityTest'], queryFn: getReceptionsPendingQualityTest },
      { queryKey: ['getReceptionsByPercentageDiference'], queryFn: getReceptionsByPercentageDiference }
    ]
  });

  const isLoading = results.some(result => result.isLoading);

  useEffect(()=>{
    if(results[0].data){
      if (results[0].data) setTotalBoletas(results[0].data);
    }
    if(results[1].data){
      if (results[1].data) setReceptionHistorics(results[1].data);
    }

  },[results])


  if(isLoading) return <Spinner />
  return (
    <div className="min-h-screen p-6">
      <h1 className="font-bold text-4xl mb-10">Dashboard de Boletas y Calidad</h1>
      <div className="w-full mx-auto">
        <div className="flex justify-between gap-10">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-sky-500 w-1/3 flex justify-center">
            <div className="flex flex-col items-center justify-center">
              <p className='font-bold text-6xl'>{totalBoletas}</p>
              <p className="text-xl font-semibold text-gray-800 mb-4">Total de Boletas Pendientes Test de Calidad</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-sky-500 flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Variación Porcentaje del Último mes</h2>
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={receptionHistorics}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barSize={22}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF2FF" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fill: '#4B5563' }} interval={0} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#4B5563' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '50px' }} />
                  <Bar dataKey="field_percentage" name="% Calidad" fill="#3498db" />
                  <Bar dataKey="quality_percentage" name="% Campo" fill="#4fc3f7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalidadDashboard;



