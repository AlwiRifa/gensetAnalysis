import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import "./App.css";
import GaugeChart from "react-gauge-chart";
import ChartBaru from "../chart/ChartDaya";

import { Link } from "react-router-dom";

const dataRef = firebase.database().ref("sensor_data");
const firestore = firebase.firestore();
const Timestamp = firebase.firestore.Timestamp;

function Dashboard() {
  const [data, setData] = useState(null);
  const [averageData, setAverageData] = useState(null);

  useEffect(() => {
    // Set up a listener to retrieve the data in real-time
    dataRef.on("value", (snapshot) => {
      setData(snapshot.val());

      // Simpan data ke Firestore
      const firestoreData = {
        voltage: snapshot.val().voltage.toFixed(1),
        current: snapshot.val().current,
        power: snapshot.val().power,
        energy: snapshot.val().energy,
        frequency: snapshot.val().frequency,
        power_factor: snapshot.val().power_factor,
        reactive_power: (
          snapshot.val().voltage *
          snapshot.val().current *
          Math.sin(Math.acos(snapshot.val().power_factor))
        ).toFixed(1),
        apparent_power: (
          snapshot.val().voltage * snapshot.val().current
        ).toFixed(1),
        kapasitor:
          snapshot.val().power_factor >= 0.9 && snapshot.val().power_factor <= 1
            ? 0
            : (
                snapshot.val().power *
                (Math.tan(Math.acos(snapshot.val().power_factor)) -
                  Math.tan(Math.acos(0.9)))
              ).toFixed(1),
        // Simpan data ke Firestore dengan nama dokumen yang dihasilkan dari tanggal dan waktu
        timestamp: Timestamp.fromDate(new Date()),
      };

      const date = new Date().toLocaleDateString().replaceAll("/", "-");
      const time = new Date().toLocaleTimeString().replaceAll(":", "-");
      const docName = `${date}_${time}`;

      // Add data to the genset_data collection
      firestore.collection("genset_data").doc(docName).set(firestoreData);

      // Average data and add to the genset_average collection
      firestore
        .collection("genset_average")
        .doc("average")
        .get()
        .then((doc) => {
          let averageData = doc.data() || {
            voltage: 0,
            current: 0,
            power: 0,
            energy: 0,
            frequency: 0,
            reactive_power: 0,
            apparent_power: 0,
            power_factor: 0,
            kapasitor: 0,
            count: 0,
          };

          averageData.voltage =
            (averageData.voltage * averageData.count + snapshot.val().voltage) / (averageData.count + 1);
          averageData.current =
            (averageData.current * averageData.count + snapshot.val().current) / (averageData.count + 1);
          averageData.power =
            (averageData.power * averageData.count + snapshot.val().power) / (averageData.count + 1);
          averageData.energy =
            (averageData.energy * averageData.count + snapshot.val().energy) / (averageData.count + 1);
          averageData.frequency =
            (averageData.frequency * averageData.count + snapshot.val().frequency) / (averageData.count + 1);
          averageData.power_factor =
            (averageData.power_factor * averageData.count + snapshot.val().power_factor) / (averageData.count + 1);
          averageData.reactive_power =
            (averageData.reactive_power * averageData.count + parseFloat(firestoreData.reactive_power || 0)) / (averageData.count + 1);
          averageData.apparent_power =
            (averageData.apparent_power * averageData.count + parseFloat(firestoreData.apparent_power || 0)) / (averageData.count + 1);
          averageData.kapasitor =
            (averageData.kapasitor * averageData.count + parseFloat(firestoreData.kapasitor)) /(averageData.count + 1);

          firestore
            .collection("genset_average")
            .doc("average")
            .set(averageData);
          setAverageData(averageData);
        });
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      dataRef.off();
    };
  }, []);

  if (!data || !averageData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-full bg-[#f6f6f9] text-[#363949] p-6 ">
      
      <div className="flex flex-col  h-full justify-center">
      <div className="flex space-x-2 text-white pb-4">
          <Link
            to={"/dashboard"}
            className="py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-400 shadow-md cursor-pointer"
          >
            Realtime
          </Link>
         
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-x-4 w-full">
              <div className="p-4 bg-white rounded-md shadow-md ">
                <p className="text-sm font-semibold">Voltage (V)</p>
                <div className="text-3xl font-bold ">
                  {averageData.voltage.toFixed(1)}
                </div>
              </div>
              <div className="p-4 bg-white rounded-md shadow-md">
                <p className="text-sm font-semibold">Current (A)</p>
                <div className="text-3xl font-bold ">
                  {averageData.current.toFixed(1)}
                </div>
              </div>
              <div className="p-4 bg-white rounded-md shadow-md ">
                <p className="text-sm font-semibold">Frequency (Hz)</p>
                <div className="text-3xl font-bold ">
                  {averageData.frequency.toFixed(1)}
                </div>
              </div>
              <div className="p-4 bg-white rounded-md shadow-md ">
                <p className="text-sm font-semibold">Active Power (W)</p>
                <div className="text-3xl font-bold ">
                  {averageData.power.toFixed(1)}
                </div>
              </div>
              <div className="p-4 bg-white rounded-md shadow-md ">
                <p className="text-sm font-semibold">Reactive Power (VAR)</p>
                <div className="text-3xl font-bold ">
                  {(
                    averageData.voltage *
                    averageData.current *
                    Math.sin(averageData.power_factor)
                  ).toFixed(1)}
                </div>
              </div>
              <div className="p-4 bg-white rounded-md shadow-md ">
                <p className="text-sm font-semibold">Apparent Power (VA)</p>
                <div className="text-3xl font-bold ">
                  {(averageData.voltage *
                    averageData.current ).toFixed(1)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md  p-4 shadow-md">
              <ChartBaru />
            </div>
          </div>

          <div className=" flex flex-col rounded-md w-[300px]">
            <div className="p-4 bg-white rounded-md shadow-md ">
              <p className="text-lg text-center font-semibold pb-4">
                Power Factor
              </p>
              <GaugeChart
                id="gauge-chart5"
                nrOfLevels={420}
                arcsLength={[0.5, 0.2, 0.2]}
                colors={["#EA4228", "yellow", "#5BE12C"]}
                percent={averageData.power_factor}
                arcPadding={0.02}
              />
              <div className="flex justify-center text-4xl font-bold ">
                {averageData.power_factor.toFixed(2)}
              </div>
              <div className=" flex  justify-center py-4 mt-6 gap-x-4">
                <p>🔴 Bad</p>
                <p>🟡 Alert</p>
                <p>🟢 Good</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded-md shadow-md h-full flex flex-col">
              <p className="text-lg font-semibold">
                Capacitor Recomendations (VAR)
              </p>
              <div className="flex justify-center items-center h-full">
                <div className=" text-7xl font-bold ">
                  {" "}
                  {averageData.power_factor >= 0.9 && averageData.power_factor <= 1
                    ? 0
                    : (
                        averageData.power *
                        (Math.tan(Math.acos(averageData.power_factor)) -
                          Math.tan(Math.acos(0.9)))
                      ).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
