'use client';
import { useState, useEffect } from 'react';

export default function SalaryDashboard() {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const workerUserId = "b7165d37-e5ea-4875-9feb-237e54099f4e"; // আপনার টেস্ট ইউজার আইডি

  useEffect(() => {
    async function fetchSalary() {
      try {
        const res = await fetch(`http://localhost:3000/api/salary/history?userId=${workerUserId}`);
        const data = await res.json();
        if (res.ok) {
          setSalaryData(data.salaryHistory);
        }
      } catch (err) {
        console.error('Error fetching salary', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSalary();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>💰 Worker Salary History</h2>
      <p style={{ color: '#555' }}>Your total attendance and calculated salary details:</p>

      {loading ? (
        <p>Loading salary details...</p>
      ) : (
        <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>Total Present Days:</td>
                <td style={{ padding: '12px', color: '#0070f3', fontWeight: 'bold' }}>
                  {salaryData?.totalDaysPresent || 0} Days
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>Daily Rate:</td>
                <td style={{ padding: '12px' }}>৳ {salaryData?.dailyRate || 0}</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '18px' }}>Total Earned Salary:</td>
                <td style={{ padding: '12px', color: 'green', fontWeight: 'bold', fontSize: '18px' }}>
                  ৳ {salaryData?.totalEarned || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <a href="/worker/dashboard" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Worker Dashboard
        </a>
      </div>
    </div>
  );
}