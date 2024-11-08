"use client";

import { testConnection } from "@/services/api";
import Map from "./graphs/map";
import ParallelCoordinatesChart from "./graphs/parallelCord";
import TaxiRunsPlot from "./graphs/taxiRuns";
import TSNEChart from "./graphs/tsneChart";
import ViolinPlot from "./graphs/viollin";
import { useEffect } from "react";

export default function Dashboard() {
     useEffect(() => {
        testConnection(); 
    }, []);

    return (
       <div className=" grid grid-cols-1 gap-4 w-full h-screen p-4">
            <div className="grid grid-cols-2 gap-x-2">
                <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
                    <TaxiRunsPlot />
                </div>
                <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
                    <ParallelCoordinatesChart />

                </div>
            </div>

            <div className="grid grid-cols-3 gap-x-2">
                <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
                    <TSNEChart />   
                </div>
                <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
                     <ViolinPlot />
                </div>
                <div className="flex p-2 bg-white shadow-md rounded-lg h-72 justify-center items-center">
                    <Map />
                </div>
            </div>
        </div>
    );
}
