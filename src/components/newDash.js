import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import "./App.css";

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
        reactive_power: (snapshot.val().voltage * snapshot.val().current * Math.sin(Math.acos(snapshot.val().power_factor))).toFixed(1),
        apparent_power: (snapshot.val().voltage * snapshot.val().current).toFixed(1),
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
            (averageData.voltage * averageData.count + snapshot.val().voltage) /
            (averageData.count + 1);
          averageData.current =
            (averageData.current * averageData.count + snapshot.val().current) /
            (averageData.count + 1);
          averageData.power =
            (averageData.power * averageData.count + snapshot.val().power) /
            (averageData.count + 1);
          averageData.energy =
            (averageData.energy * averageData.count + snapshot.val().energy) /
            (averageData.count + 1);
          averageData.frequency =
            (averageData.frequency * averageData.count +
              snapshot.val().frequency) /
            (averageData.count + 1);
          averageData.power_factor =
            (averageData.power_factor * averageData.count +
              snapshot.val().power_factor) /
            (averageData.count + 1);
          averageData.reactive_power =
            (averageData.reactive_power * averageData.count +
              parseFloat(firestoreData.reactive_power || 0)) /
            (averageData.count + 1);
          averageData.apparent_power =
            (averageData.apparent_power * averageData.count +
              parseFloat(firestoreData.apparent_power || 0)) /
            (averageData.count + 1);
          averageData.kapasitor =
            (averageData.kapasitor * averageData.count +
              parseFloat(firestoreData.kapasitor)) /
            (averageData.count + 1);
          averageData.count += 1;


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
    <div className="px-12">
      <h1>Genset Realtime Data</h1>
      <div className="data-grid">
        <div className="data-item">
          <div className="data-label">Voltage (V)</div>
          <div className="data-value">{data.voltage.toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Current (A)</div>
          <div className="data-value">{data.current.toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Frequency (Hz)</div>
          <div className="data-value">{data.frequency.toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Active Power (W)</div>
          <div className="data-value">{data.power.toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Reactive Power (Q)</div>
          <div className="data-value">{(data.voltage * data.current * Math.sin(data.power_factor)).toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Apparent Power (S)</div>
          <div className="data-value">{(data.voltage * data.current).toFixed(1)}</div>
        </div>
        
        <div className="data-item">
          <div className="data-label">Power Factor</div>
          <div className="data-value">{data.power_factor.toFixed(2)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Kapasitor (kVAR)</div>
          <div className="data-value">
            {data.power_factor >= 0.9 && data.power_factor <= 1
              ? 0
              : (
                data.power *
                (Math.tan(Math.acos(data.power_factor)) -
                  Math.tan(Math.acos(0.9)))
              ).toFixed(1)}
          </div>
        </div>
      </div>
      <h1>Average Data</h1>
      <div className="data-grid">
        <div className="data-item">
          <div className="data-label">Voltage (V)</div>
          <div className="data-value">{averageData.voltage.toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Current (A)</div>
          <div className="data-value">{averageData.current.toFixed(1)}</div>
        </div>
        
        <div className="data-item">
          <div className="data-label">Frequency (Hz)</div>
          <div className="data-value">{averageData.frequency.toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Active Power (W)</div>
          <div className="data-value">{averageData.power.toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Reactive Power (Q)</div>
          <div className="data-value">{(averageData.voltage * averageData.current * Math.sin(averageData.power_factor)).toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Apparent Power (S)</div>
          <div className="data-value">{(averageData.voltage * averageData.current).toFixed(1)}</div>
        </div>
        <div className="data-item">
          <div className="data-label">Power Factor</div>
          <div className="data-value">
            {averageData.power_factor.toFixed(2)}
          </div>
        </div>
        <div className="data-item">
          <div className="data-label">Kapasitor (kVAr)</div>
          <div className="data-value">{averageData.kapasitor.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
