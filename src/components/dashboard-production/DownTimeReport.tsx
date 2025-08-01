import { TooltipProps } from "recharts";
const COLORS = ["#6366F1", "#22D3EE", "#34D399", "#FBBF24", "#F87171"]; //Here we can update the colors options

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const downtimeInformation = [
  { name: "Falta de materia prima", minutos: 120 },
  { name: "Falta de material de empaque", minutos: 90 },
  { name: "Falla en maquinaria", minutos: 150 },
  { name: "Retraso logístico", minutos: 60 },
  { name: "Cambio de formato", minutos: 45 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-gray-800 font-semibold mb-2">{label}</p>
        <p className="text-gray-600 text-sm">
          Tiempo perdido:{" "}
          <span className="font-bold text-gray-800">
            {payload[0].value} minutos
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function DownTimeReport() {
  return (
    <div className="flex flex-col items-center shadow-xl row-start-4 col-start-1 col-span-12 rounded-xl gap-5 w-full">
      <p className="uppercase w-full text-center bg-gradient-to-r from-slate-700 to-slate-600 text-white p-3 font-bold rounded-t-xl text-2xl">
        Tiempo muerto más reportado
      </p>
      <div className="w-full bg-white rounded-b-lg shadow-sm p-5">
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={downtimeInformation}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                label={{
                  value: "Minutos",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#6B7280",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  marginTop: 40,
                  color: "#374151",
                  padding: "8px 0",
                  fontWeight: 600,
                  fontSize: 14,
                  textAlign: "center",
                }}
              />
              <Bar
                className="mt-20"
                dataKey="minutos"
                name="Minutos Perdidos"
                radius={[4, 4, 0, 0]}
              >
                {downtimeInformation.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
