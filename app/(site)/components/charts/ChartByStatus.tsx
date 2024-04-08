import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import SkeletonCharts from "../SkeletonCharts";
import { TicketsByStaus } from "@/actions/tickets";

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverOffset: number;
  }[];
} | null;

const ChartByStatus = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<ChartData>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await TicketsByStaus();
        const data = await response;
        setChartData({
          labels: data.map((item: { status: any }) => item.status),
          datasets: [
            {
              label: "Tickets por Status",
              data: data.map((item: { count: any }) => item.count),
              backgroundColor: [
                // Agrega aquí tantos colores como estados tengas
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#F7464A",
                "#949FB1",
                "#4D5360",
              ],
              hoverOffset: 4,
            },
          ],
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    if (chartRef.current && chartData) {
      const myPieChart = new Chart(chartRef.current, {
        type: "pie",
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });

      return () => myPieChart.destroy();
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

export default ChartByStatus;
