import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdDashboard,
  MdViewList,
  MdInsertChart,
  MdMenu,
  MdClose,
} from "react-icons/md";

function Navbar() {
  const [collapse, setCollapse] = useState(true);

  const toggleCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <div
      className={`h-screen ${
        collapse ? "w-20" : "w-64"
      } bg-gray-200 flex flex-col gap-6 border-r-2 border`}>
      <div className="bg-blue-500 flex items-center justify-between p-4">
        <div className={` text-xl font-semibold ${collapse ? "hidden" : ""}`}>
          Genset Monitoring
        </div>
        <button className="translate-x-2" onClick={toggleCollapse}>
          {collapse ? <MdMenu size={24} /> : <MdClose size={24} />}
        </button>
      </div>
      <div className="flex flex-col w-full gap-4 text-black">
        <Link
          to={"/dashboard"}
          className={`hover:bg-blue-500 w-full hover:text-white rounded-md py-2 px-4 ${
            collapse && "text-center"
          }`}>
          <MdDashboard className="inline-block mr-2" />{" "}
          {!collapse && "Dashboard"}
        </Link>
        <Link
          to={"/dataGrid"}
          className={`hover:bg-blue-500 w-full hover:text-white rounded-md py-2 px-4 ${
            collapse && "text-center"
          }`}>
          <MdViewList className="inline-block mr-2" />{" "}
          {!collapse && "Data Grid"}
        </Link>
        <Link
          to={"/chart"}
          className={`hover:bg-blue-500 w-full hover:text-white rounded-md py-2 px-4 ${
            collapse && "text-center"
          }`}>
          <MdInsertChart className="inline-block mr-2" /> {!collapse && "Chart"}
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
