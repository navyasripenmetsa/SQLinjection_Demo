import { useEffect, useState } from 'react';
import api from '../api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [summary, setSummary] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, logsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/logs')
        ]);
        setSummary(summaryRes.data);
        setLogs(logsRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load dashboard');
      }
    };
    load();
  }, []);

  const chartData = {
    labels: summary.map((item) => item.attack_type),
    datasets: [{
      data: summary.map((item) => item.count),
      backgroundColor: ['#2C3E50', '#6c8093', '#95A5A6', '#bfd0df', '#d9e2ec']
    }]
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ color: '#2C3E50' }}>Security Dashboard</h2>
        <p style={styles.note}>Shows blocked or suspicious activity recorded by the secure backend.</p>
        {error && <p style={styles.error}>{error}</p>}
        {summary.length > 0 && <div style={{ width: 360, margin: '0 auto' }}><Pie data={chartData} /></div>}
        <table style={styles.table}>
          <thead>
            <tr>
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
                <td>{String(log.timestamp)}</td>
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
    </div>
  );
}

const styles = {
  page: { padding: 24 },
  card: { background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 8px 28px rgba(44,62,80,0.08)' },
  note: { color: '#5d6d7e' },
  error: { color: '#b03a2e' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 24 },
};
