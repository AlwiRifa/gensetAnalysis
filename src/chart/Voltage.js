import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function Voltage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dataRef = firebase.firestore().collection("genset_data");
    const unsubscribe = dataRef.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      const newData = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const formattedTimestamp = docData.timestamp.toDate().toLocaleString();
        return { ...docData, timestamp: formattedTimestamp };
      });
      setData(newData.reverse()); // Membalik urutan data sebelum memperbarui state
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <LineChart width={500} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="voltage" stroke="#82ca9d" name="Voltage (V)" strokeWidth={2} dot={false} />
    </LineChart>
  );
}

export default Voltage;
