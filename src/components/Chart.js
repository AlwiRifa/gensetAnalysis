import React from "react";
import Current from "../chart/Current";
import Voltage from "../chart/Voltage";
import Kapasitor from "../chart/Kapasitor";
import PowerFactor from "./PowerFactor";

function Chart() {
  return (
    <div className="hidden md:flex bg-[#f6f6f9] text-[#363949] h-screen w-full y-20  flex-col gap-4 justify-center items-center">
      <div className="flex grid-cols-2  gap-8 ">
        <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl shadow-md">
          <h1 className="text-3xl my-2">Current (A)</h1>
          <Current />
        </div>
        <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl shadow-md">
          <h1 className="text-3xl my-2"> Voltage (V)</h1>
          <Voltage />
        </div>
      </div>
      <div className="flex grid-cols-2 gap-8 ">
        <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl shadow-md">
          <h1 className="text-3xl my-2">Power Factor (cosφ)</h1>
          <PowerFactor />
        </div>
        <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl shadow-md">
          <h1 className="text-3xl my-2">Capacitor (VAR)</h1>
          <Kapasitor />
        </div>
      </div>
    </div>
  );
}

export default Chart;
