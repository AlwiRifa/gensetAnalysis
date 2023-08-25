import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function ChartBaru() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dataRef = firebase.firestore().collection("genset_data");
    const unsubscribe = dataRef.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      const newData = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const formattedTimestamp = docData.timestamp.toDate().toLocaleString();

        // Perkalian reactive power dengan nilai konstanta (misalnya 2)
        const ApparentPower = (docData.voltage * docData.current).toFixed(2);
        const ReactivePower = (docData.voltage * docData.current *  Math.sin(Math.acos(docData.power_factor))).toFixed(2);

        return { ...docData, timestamp: formattedTimestamp, ApparentPower: ApparentPower, ReactivePower: ReactivePower };
      });
      setData(newData.reverse()); // Membalik urutan data sebelum memperbarui state
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      {/* Menambahkan dataKey dan name untuk ApparentPower */}
      <Line type="monotone" dataKey="ApparentPower" stroke="purple" strokeWidth={2} dot={false} name="Apparent Power (S)" />
      <Line type="monotone" dataKey="ReactivePower" stroke="green" strokeWidth={2} dot={false} name="Reactive Power (Q)" />
      <Line type="monotone" dataKey="power" stroke="red" strokeWidth={2} dot={false} name="Active Power (P)"/>
    </LineChart>
  );
}

export default ChartBaru;
