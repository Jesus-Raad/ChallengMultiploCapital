"use client"
import React, { useContext, useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CapitalContext } from '@/context/capitalContext';
ChartJS.register(ArcElement, Tooltip, Legend);
const AnalysisSection = () => {
   
  const { data } = useContext(CapitalContext);
  const [dataDetail, setDataDetail]=useState([])


useEffect(() => {
  const savedRows = localStorage.getItem("tableRows");

  setDataDetail(JSON.parse(savedRows).slice(1))
}, []);



const [organizedData, setOrganizedData] = useState([]);

useEffect(() => {
  // Organizar la data cuando dataDetail o data cambien
  const organizeData = (dataDetail, data) => {
    return dataDetail.map(row => {
      const name = row.cells.find(cell => cell.columnId === 'name').text;
      const acc = parseFloat(row.cells.find(cell => cell.columnId === 'acc').text);
      const price = parseFloat(row.cells.find(cell => cell.columnId === 'price').text);

      // Buscar el tipo de activo en la otra tabla
      const activeTypeData = data.find(d => d.name === name);
      
      
      const activeType = activeTypeData ? activeTypeData.type : 'Unknown';

      // Calcular el totalValue
      const totalValue = acc * price;

      return {
        name,
        acc,
        price,
        totalValue,
        activeType
      };
    });
  };

  if (dataDetail.length > 0 ) {
    const newData = organizeData(dataDetail, data);
    setOrganizedData(newData);
  }
}, [dataDetail, data]);






// Configuración del gráfico circular
const chartData = {
  labels: [...new Set(organizedData.map(item => item.activeType))], // Tipos únicos de activos
  datasets: [
      {
          data: organizedData.reduce((acc, item) => {
              const typeIndex = acc.findIndex((entry) => entry.type === item.activeType); 
              const value = item.totalValue;

              if (typeIndex >= 0) {
                  acc[typeIndex].value += value; // Sumar al valor existente
              } else {
                  acc.push({ type: item.activeType, value }); // Agregar nuevo tipo con su valor
              }

              return acc;
          }, [])
          .map(entry => entry.value), // Tomar solo los valores por tipo de activo
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
  {organizedData.length > 0 ? (
    organizedData.map((data) => (
      <tr key={data.name}>
        <td className="p-3 border-t">{data.name}</td>
        <td className="p-3 border-t">{data.acc}</td>
        <td className="p-3 border-t">${data.price}</td>
        <td className="p-3 border-t">${data.totalValue}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="p-3 text-center">Cargando...</td>
    </tr>
  )}
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

