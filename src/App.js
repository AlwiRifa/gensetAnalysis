import React from "react";
import { Route, Routes } from "react-router";
import Dashboard from "./components/Dashboard";
import DataGrid from "./components/DataGrid";
import Layout from "./Layout";
import Chart from "./components/Chart";
import AverageDashboard from './components/AverageDashboard'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dataGrid" element={<DataGrid />} />
        <Route path="/chart" element={<Chart/>}/>
        <Route path="/averageDashboard" element={<AverageDashboard/>}/>
      </Route>
    </Routes>
  );
}

export default App;
