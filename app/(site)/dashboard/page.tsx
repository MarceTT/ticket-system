"use client";
import ChartByCategory from "../components/charts/ChartByCategory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartByStatus from "../components/charts/ChartByStatus";
import ChartByPriority from "../components/charts/ChartByPriority";

type Props = {};

const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 mx-auto max-w-7xl">
      <div className="mx-auto w-full max-w-5xl grid gap-4 sm:grid-cols-1">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle>Bar chart</CardTitle>
          </CardHeader>
          <CardContent className="grid place-items-center h-[400px]">
            <ChartByCategory />
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle>Line chart</CardTitle>
          </CardHeader>
          <CardContent className="grid place-items-center h-[400px]">
            <ChartByStatus />
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle>Area chart</CardTitle>
          </CardHeader>
          <CardContent className="grid place-items-center h-[400px]">
            <ChartByPriority />
          </CardContent>
        </Card>
        {/* <Card>
        <CardHeader>
          <CardTitle>Grouped Bar chart</CardTitle>
        </CardHeader>
        <CardContent className="grid place-items-center h-[400px]">
          <ChartByCategory />
        </CardContent>
      </Card> */}
      </div>
    </div>
  );
};

export default Dashboard;
