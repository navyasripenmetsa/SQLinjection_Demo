import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
function Dashboard() {
  const [summary, setSummary] = useState([]);
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    fetchSummary();
    fetchLogs();
  }, []);

  const fetchSummary = async () => {
    const res = await axios.get("http://127.0.0.1:5000/dashboard/summary");
    setSummary(res.data);
  };

  const fetchLogs = async () => {
    const res = await axios.get("http://127.0.0.1:5000/dashboard/logs");
    setLogs(res.data);
  };

  const chartData = {
    labels: summary.map(item => item.attack_type),
    datasets: [
      {
        label: "Attack Distribution",
        data: summary.map(item => item.count),
        backgroundColor: [
          "#2C3E50",
          "#3498DB",
          "#95A5A6",
          "#1ABC9C"
        ]
      }
    ]
  };

  return (
    <div>
      {/* Pie Chart */}
      <div style={{ width: "400px", margin: "auto" }}>
        <Pie data={chartData} />
      </div>

      {/* Logs Table */}
      <h2 style={{ marginTop: "40px", color: "#2C3E50" }}>
        Recent Attacks
      </h2>

      <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#2C3E50", color: "#fff" }}>
            <th>Time</th>
            <th>IP</th>
            <th>Endpoint</th>
            <th>Type</th>
            <th>Payload</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>{log.ip_address}</td>
              <td>{log.endpoint}</td>
              <td>{log.attack_type}</td>
              <td>{log.payload}</td>
              <td>{log.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;