import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import "firebase/firestore";
import "./DataGrid.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const dataRef = firebase.firestore().collection("genset_data");

function DataGrid() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = dataRef
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const newData = snapshot.docs.map((doc) => {
          const docData = doc.data();
          const formattedTimestamp = docData.timestamp
            .toDate()
            .toLocaleString();
          return { ...docData, timestamp: formattedTimestamp };
        });
        setData(newData);
      });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * 15;
    const endIndex = startIndex + 15;
    return data.slice(startIndex, endIndex).map((item, index) => (
      <tr key={index}>
        <td>{startIndex + index + 1}</td>
        <td>{item.timestamp}</td>
        <td>{item.current}</td>
        <td>{item.voltage}</td>
        <td>{item.power}</td>
        <td>{(item.voltage * item.current * Math.sin(Math.acos(item.power_factor))).toFixed(1)}</td>
        <td>{(item.voltage * item.current).toFixed(1)}</td>
        <td>{item.frequency}</td>
        <td>{item.power_factor}</td>
        <td>{item.kapasitor}</td>
      </tr>
    ));
  };

  const renderNextButton = () => {
    const totalRows = data.length;
    if (totalRows <= currentPage * 15) {
      return null; // No more data to show
    }
    return (
      <div className="pagination-buttons bg-blue-500 rounded-md">
        <button onClick={handleNextPage}>Next</button>
      </div>
    );
  };

  const renderPreviousButton = () => {
    if (currentPage === 1) {
      return null; // Already on the first page
    }
    return (
      <div className="pagination-buttons bg-blue-500 rounded-md">
        <button onClick={handlePreviousPage}>Previous</button>
      </div>
    );
  };

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.table_to_book(
      document.getElementById("data-table")
    );
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "data_grid.xlsx");
  };

  return (
    <div className=" h-screen w-full bg-[#f6f6f9] text-[#363949] px-12 py-6">
    <div className="flex flex-row py-2 gap-4">
      <span className="font-bold text-2xl">Genset Data</span>
      <button onClick={handleDownloadExcel} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white">Download Data</button></div>
      <table className="data-table" id="data-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Timestamp</th>
            <th>Current (A)</th>
            <th>Voltage (V)</th>
            <th>Active Power (W)</th>
            <th>Reactive Power (VAR)</th>
            <th>Apparent Power (VA)</th>
            <th>Frequency (Hz)</th>
            <th>Power Factor</th>
            <th>Kapasitor (VAR)</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      <div className="pagination-container">
        {renderPreviousButton()}
        {renderNextButton()}
      </div>
    </div>
  );
}

export default DataGrid;
