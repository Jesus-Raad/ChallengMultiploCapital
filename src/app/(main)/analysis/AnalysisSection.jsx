"use client"
import React, { useContext, useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CapitalContext } from '@/context/capitalContext';
ChartJS.register(ArcElement, Tooltip, Legend);
const AnalysisSection = () => {
   
  const [currentValue, setCurrentValue] = useState(0);
  const {dataDetail, setDataDetail}=useContext(CapitalContext)
console.log(dataDetail);

 
useEffect(() => {
    // Calcular el valor actual del portafolio
    const totalValue = dataDetail.reduce((acc, item) => {
        return acc + (item.shares * item.price);
    }, 0);
    setCurrentValue(totalValue);
}, []);

// Configuración del gráfico circular
const chartData = {
    labels: [...new Set(dataDetail.map(item => item.type))], // Tipos únicos de activos
    datasets: [
        {
            data: dataDetail.reduce((acc, item) => {
                const typeIndex = acc.findIndex((entry) => entry.type === item.type);
                const value = item.shares * item.price;

                if (typeIndex >= 0) {
                    acc[typeIndex].value += value;
                } else {
                    acc.push({ type: item.type, value });
                }

                return acc;
            }, []).map(entry => entry.value), // Valores por tipo de activo
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1,
        },
    ],
};

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    return `${label}: $${value.toFixed(2)}`;
                }
            }
        }
    },
};

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Análisis de Portafolio</h2>
      
      {/* Tabla de Valor Actual */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Valor Actual del Portafolio</h3>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Activo</th>
              <th className="p-3 text-left">Acciones</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {  dataDetail.length>0? dataDetail.map((data)=>{
                return(
                    <tr>
              <td className="p-3 border-t">{data.name}</td>
              <td className="p-3 border-t">{data.shares}</td>
              <td className="p-3 border-t">${data.price}</td>
              <td className="p-3 border-t">${(data.price*data.shares).toFixed(2)}</td>
            </tr>
                )
            }):<p>cargando...</p>
        }
            
          </tbody>
        </table>
      </div>

      {/* Gráfico Circular con Chart.js */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Distribución por Tipo de Activo</h3>
        <div className="h-[400px] flex justify-center">
          <div className="w-[400px]">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisSection