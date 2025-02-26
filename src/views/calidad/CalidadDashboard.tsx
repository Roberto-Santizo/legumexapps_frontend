import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Datos estáticos d
//  Reemplazar este array cuando conectes la db
const datosEstados = [
  { nombre: 'Ingreso de Campo', estado: 1, cantidad: 24 },
  { nombre: 'Producción', estado: 2, cantidad: 38 },
  { nombre: 'Calidad', estado: 3, cantidad: 16 },
  { nombre: 'GRN', estado: 4, cantidad: 12 },
  { nombre: 'Finalizado', estado: 5, cantidad: 45 }
];

// Reemplazar este array cuando conectes la db
const datosProductores = [
  { id: 1, nombre: 'Finca Alameda', pesoNeto: 34000, porcentajePago: 92.4, porcentajeCampo: 95.1 },
  { id: 2, nombre: 'Finca Linda Sofia 1', pesoNeto: 63380, porcentajePago: 88.7, porcentajeCampo: 94.2 },
  { id: 3, nombre: 'Finca Linda Sofia 2', pesoNeto: 21700, porcentajePago: 95.3, porcentajeCampo: 96.1 },
  { id: 4, nombre: 'Finca Tehuya', pesoNeto: 72050, porcentajePago: 90.6, porcentajeCampo: 92.3 },
  { id: 5, nombre: 'Finca Victoria', pesoNeto: 41820, porcentajePago: 86.8, porcentajeCampo: 93.5 },
  { id: 6, nombre: 'Finca Ovejero', pesoNeto: 49700, porcentajePago: 84.5, porcentajeCampo: 91.2 }
];

// Cálculo de finca con mayor diferencia
const diferenciasFincas = datosProductores.map(productor => ({
  ...productor,
  diferencia: Math.abs(productor.porcentajeCampo - productor.porcentajePago)
}));

const fincaMayorDiferencia = diferenciasFincas.reduce((prev, current) => 
  (prev.diferencia > current.diferencia) ? prev : current
);

// Colores profesionales con tonos actualizados
// Reemplazar este array cuando conectes la db
const COLORS = ['#3498db', '#2ecc71', '#4fc3f7', '#9be7ff', '#55e6c1', '#74b9ff'];

// Tipos para las props del componente CircularMeter
interface CircularMeterProps {
  value: number | string;
  maxValue: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  textColor?: string;
  suffix?: string;
}

// Componente para medidor circular personalizado usando 
const CircularMeter: React.FC<CircularMeterProps> = ({ 
  value, 
  maxValue, 
  color, 
  size = 120, 
  strokeWidth = 10, 
  textColor = '#333', 
  suffix = '' 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const progress = (numericValue / maxValue) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <div className="text-lg font-bold" style={{ color: textColor }}>
          {typeof value === 'number' ? value.toFixed(1) : value}{suffix}
        </div>
      </div>
    </div>
  );
};

const CalidadDashboard: React.FC = () => {
  const [productorSeleccionado, setProductorSeleccionado] = useState(datosProductores[0]);
  const totalBoletas = datosEstados.reduce((sum, estado) => sum + estado.cantidad, 0);

  // Función segura para manejar el cambio de productor
  const handleProductorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const selectedProducer = datosProductores.find(p => p.id === selectedId);
    if (selectedProducer) {
      setProductorSeleccionado(selectedProducer);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Dashboard de Boletas y Calidad</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total de boletas en proceso */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-sky-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Total de Boletas en Proceso</h2>
            <div className="flex justify-center">
              <CircularMeter
                value={totalBoletas}
                maxValue={200}
                color="#3B82F6"
                textColor="#1E40AF"
                size={140}
                strokeWidth={12}
              />
            </div>
            <p className="text-center mt-4 text-gray-700 font-medium">Total: {totalBoletas} boletas</p>
          </div>
          
          {/* Finca con mayor diferencia */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-1 lg:col-span-2 border-t-4 border-red-500">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">Finca con Mayor Diferencia en el Porcentaje de Calidad</h2>
            <div className="p-2">
              <div className="font-bold text-gray-800 text-xl mb-4">{fincaMayorDiferencia.nombre}</div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Porcentaje Campo:</p>
                  <p className="text-3xl font-bold text-blue-600">{fincaMayorDiferencia.porcentajeCampo}%</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Porcentaje Calidad:</p>
                  <p className="text-3xl font-bold text-blue-800">{fincaMayorDiferencia.porcentajePago}%</p>
                </div>
                <div className="col-span-2 bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Diferencia:</p>
                  <p className="text-4xl font-bold text-red-600">{fincaMayorDiferencia.diferencia.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Boletas por Estado */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-blue-600">
                      <h2 className="text-xl font-semibold text-indigo-800 mb-4">Boletas por Estado</h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosEstados} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2FF" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={70} tick={{ fill: '#4B5563' }} />
                <YAxis tick={{ fill: '#4B5563' }} />
                <Tooltip 
                  formatter={(value) => [`${value} boletas`, 'Cantidad']}
                  contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="cantidad" 
                  name="Cantidad de Boletas" 
                  fill="#3498db" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Distribución de Estados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-sky-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Distribución de Estados</h2>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosEstados}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="cantidad"
                    nameKey="nombre"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {datosEstados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} boletas`, 'Cantidad']}
                    contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Porcentaje de Calidad vs Campo */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-sky-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Variación del % de Calidad entre Campo y Planta por Finca</h2>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={datosProductores}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barSize={22}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF2FF" />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={70} tick={{ fill: '#4B5563' }} interval={0} />
                  <YAxis domain={[80, 100]} tick={{ fill: '#4B5563' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="porcentajeCampo" name="% Campo" fill="#3498db" />
                  <Bar dataKey="porcentajePago" name="% Calidad" fill="#4fc3f7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Métricas de recepción */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-sky-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Métricas de Recepción en Producción</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Productor:</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={productorSeleccionado.id}
              onChange={handleProductorChange}
            >
              {datosProductores.map(productor => (
                <option key={productor.id} value={productor.id}>
                  {productor.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Peso Neto Recibido</h3>
              <div className="flex justify-center mb-4">
                <CircularMeter
                  value={(productorSeleccionado.pesoNeto / 1000).toFixed(1)}
                  maxValue={100}
                  color="#3498db"
                  textColor="#2980b9"
                  suffix="K"
                  size={120}
                  strokeWidth={12}
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 mb-1">Total en Libras</p>
                <p className="text-2xl font-bold text-gray-800">{productorSeleccionado.pesoNeto.toLocaleString()} lb</p>
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Porcentaje a Pagar</h3>
              <div className="flex justify-center mb-4">
                <CircularMeter
                  value={productorSeleccionado.porcentajePago}
                  maxValue={100}
                  color={productorSeleccionado.porcentajePago >= 90 ? '#2ecc71' : 
                        productorSeleccionado.porcentajePago >= 85 ? '#f39c12' : '#e74c3c'}
                  textColor="#2c3e50"
                  suffix="%"
                  size={120}
                  strokeWidth={12}
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 mb-1">Evaluación de Calidad</p>
                <p className="text-2xl font-bold" style={{
                  color: productorSeleccionado.porcentajePago >= 90 ? '#2ecc71' : 
                         productorSeleccionado.porcentajePago >= 85 ? '#f39c12' : '#e74c3c'
                }}>
                  {productorSeleccionado.porcentajePago >= 90 ? 'Excelente' : 
                   productorSeleccionado.porcentajePago >= 85 ? 'Bueno' : 'Regular'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalidadDashboard;



