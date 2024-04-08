"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { TicketByCategory } from "@/actions/tickets";
import SkeletonCharts from "../SkeletonCharts";

type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
} | null;

const ChartByCategory = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState<ChartDataType>(null);
  const [isLoading, setIsLoading] = useState(true);

  const transformChartData = (data: any) => {
    return {
      labels: data.map((item: { name: any }) => item.name),
      datasets: [
        {
          label: "Tickets by category",
          data: data.map((item: { count: any }) => item.count),
          backgroundColor: "rgba(54, 162, 235, 0.5)", // Ajusta según tus necesidades
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TicketByCategory(); // Asume que tienes una endpoint de API ticketsByCategory
        setChartData(transformChartData(response)); // Transforma y guarda los datos en el estado
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current && chartData) {
      // Asegúrate de que el ref y los datos estén disponibles
      const myChart = new Chart(chartRef.current, {
        type: "bar", // o el tipo de gráfico que prefieras
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              enabled: true,
            },
          },
          animation: {
            delay: (context) => {
                // Calcula el delay solo en función del dataIndex y datasetIndex
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default') {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100; // Ajusta estos valores según necesites
                }
                return delay;
            }
        },
        },
      });

      return () => myChart.destroy(); // Limpieza al desmontar el componente
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
  );
};

export default ChartByCategory;
