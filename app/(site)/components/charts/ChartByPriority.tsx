'use client';

import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto';
import { TicketWithPriorityByUser } from '@/actions/tickets';
import SkeletonCharts from '../SkeletonCharts';


interface TicketWithPriority {
    id: string; // Asumiendo que el ID del ticket es un string
    status: string; // Asumiendo que el status del ticket es un string
    priority: {
      id: string; // ID de la prioridad, si lo necesitas
      name: string; // El nombre de la prioridad para mostrar en el gráfico
    };
    assigened: {
      name: string; // Nombre del usuario asignado para mostrar en el gráfico
    };
    // ... otras propiedades relevantes que quieras incluir en el gráfico
  }

interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      hoverOffset: number;
    }[];
  }


  const transformDataForChart = (data: TicketWithPriority[]): ChartData => {
    // Agrupar tickets por 'assignedTo.name' y contarlos por 'priority.name'
    const counts: Record<string, Record<string, number>> = {}; // Estructura para contar tickets
  
    data.forEach(ticket => {
      if (!counts[ticket.assigened.name]) {
        counts[ticket.assigened.name] = {};
      }
      if (!counts[ticket.assigened.name][ticket.priority.name]) {
        counts[ticket.assigened.name][ticket.priority.name] = 0;
      }
      counts[ticket.assigened.name][ticket.priority.name]++;
    });
  
    const datasets = Object.keys(counts).map(assignedToName => {
      const prioritiesCount = counts[assignedToName];
      return {
        label: assignedToName,
        data: Object.values(prioritiesCount),
        backgroundColor: Object.keys(prioritiesCount).map(() => `hsl(${360 * Math.random()}, 100%, 75%)`), // Genera colores aleatorios para cada prioridad
        hoverOffset: 4
      };
    });
  
    return {
      labels: Object.keys(counts[Object.keys(counts)[0]]), // Usa las prioridades del primer usuario como etiquetas
      datasets
    };
  };

const ChartByPriority = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
          try {
            const response = await TicketWithPriorityByUser();
            const transformedData: ChartData = transformDataForChart(response as TicketWithPriority[]);
            setChartData(transformedData);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching chart data:', error);
            setIsLoading(false);
          }
        };
    
        fetchChartData();
      }, []);


      useEffect(() => {
        if (chartRef.current && chartData) {
          const myBarChart = new Chart(chartRef.current, {
            type: 'bar', // o 'stackedBar' para un gráfico de barras apiladas
            data: chartData,
            options: {
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                }
              },
              // ... otras opciones
            },
          });
    
          return () => myBarChart.destroy();
        }
      }, [chartData]);




  return (
    <div className="h-full w-full flex justify-center items-center">
    {isLoading ? (
      <SkeletonCharts />
    ) : (
      <canvas ref={chartRef} className="max-w-xl max-h-96"></canvas>
    )}
  </div>
  )
}

export default ChartByPriority