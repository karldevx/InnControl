import React from "react";
import { RadarChartDots } from "./_components/charts/radar-chart";
import { ChevronRight } from "lucide-react";
import { TotalRevenue } from "./_components/charts/total-revenue-chart";

const Page = () => {
  return (
    <div className="flex flex-col p-1 w-full">
      <div className="flex items-center gap-x-1">
        <span className="font-medium">InnControl</span>
        <ChevronRight size={19} />
        <span className="font-medium">Dashboard</span>
      </div>
      <div className="grid md:grid-cols-3 gap-x-3">
        <div className="bg-slate-400"></div>
        <TotalRevenue/>
        <RadarChartDots />
      </div>
    </div>
  );
};

export default Page;
