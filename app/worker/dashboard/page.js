'use client';
import { useState, useEffect } from 'react';

export default function WorkerDashboard() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // যাচাইকৃত ডাটাবেস ইউজার আইডি ব্যবহার করুন
  const workerUserId = "b7165d37-e5ea-4875-9feb-237e54099f4e";

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const res = await fetch(`http://localhost:3000/api/attendance/history?userId=${workerUserId}`);
        const data = await res.json();
        if (res.ok) {
          setAttendanceList(data.attendances || []);
        } else {
          setMessage(data.error || 'Failed to load history');
        }
      } catch (err) {
        setMessage('Server connection error');
      } finally {
        setLoading(false);
      }
    }

    fetchAttendance();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '700px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>👷 Worker Dashboard</h2>
      <p style={{ color: '#555' }}>View your attendance records and work history below:</p>

      <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3>Attendance History</h3>

        {loading ? (
          <p>Loading records...</p>
        ) : message ? (
          <p style={{ color: 'red' }}>{message}</p>
        ) : attendanceList.length === 0 ? (
          <p>No attendance records found yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#0070f3', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Date & Time</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>
                    {new Date(item.checkIn || item.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px', color: 'green', fontWeight: 'bold' }}>
                    PRESENT ✅
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/attendance" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Give Attendance Page
        </a>
      </div>
    </div>
  );
}