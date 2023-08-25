import React from "react";

import Navbar from "./components/Navbar";
import { Outlet } from "react-router";

function Layout() {
  return (
    <div className="flex  relative min-h-screen  ">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Layout;
