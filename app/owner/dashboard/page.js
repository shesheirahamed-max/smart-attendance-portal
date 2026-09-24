'use client';
import { useState, useEffect } from 'react';

export default function OwnerDashboard() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchWorkersData() {
    try {
      const res = await fetch('/api/owner/workers-attendance');
      const data = await res.json();
      if (res.ok) {
        // ডেটা ফিল্টার ও সেফটি চেক যাতে NaN না আসে
        const formattedWorkers = (data.workers || []).map(w => {
          const presentDays = Number(w.totalPresentDays) || 0;
          const rate = Number(w.salaryRate) || 500; // ডিফল্ট রেট ৫০০ ধরা হলো
          return {
            ...w,
            salaryRate: rate,
            totalPresentDays: presentDays,
            totalEarned: presentDays * rate
          };
        });
        setWorkers(formattedWorkers);
      }
    } catch (err) {
      console.error('Error fetching workers attendance', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkersData();
  }, []);

  const handleRateChange = (id, newRate) => {
    const rateNum = Number(newRate) || 0;
    setWorkers(workers.map(worker => 
      worker.id === id ? { 
        ...worker, 
        salaryRate: newRate, 
        totalEarned: worker.totalPresentDays * rateNum 
      } : worker
    ));
  };

  const saveSalaryRate = async (id, salaryRate) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/owner/update-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, salaryRate: Number(salaryRate) }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Salary rate updated successfully!');
        fetchWorkersData();
      } else {
        alert('Failed: ' + data.error);
      }
    } catch (err) {
      console.error('Error updating salary rate', err);
      alert('An error occurred.');
    } finally {
      setUpdatingId(null);
    }
  };

  const totalWorkersCount = workers.length;
  const totalPresentCount = workers.reduce((acc, curr) => acc + (Number(curr.totalPresentDays) || 0), 0);
  const grandTotalPayroll = workers.reduce((acc, curr) => acc + (Number(curr.totalEarned) || 0), 0);

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>👑 Owner Dashboard - Workers Summary & Salary Management</h2>
      <p style={{ color: '#555' }}>Monitor attendance and manage company-wide payroll easily:</p>

      {loading ? (
        <p>Loading summary...</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
            <div style={{ flex: 1, background: '#f0f4f8', padding: '20px', borderRadius: '8px', border: '1px solid #d9e2ec' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#334e68' }}>Total Workers</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#102a43' }}>{totalWorkersCount}</p>
            </div>
            <div style={{ flex: 1, background: '#e3fcef', padding: '20px', borderRadius: '8px', border: '1px solid #abf5d1' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#067647' }}>Total Present Days</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#027a48' }}>{totalPresentCount} Days</p>
            </div>
            <div style={{ flex: 1, background: '#eef2ff', padding: '20px', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#3730a3' }}>Grand Total Payroll</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#312e81' }}>৳ {grandTotalPayroll}</p>
            </div>
          </div>

          <div style={{ marginTop: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ background: '#f4f4f4', borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Worker Name</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Daily Rate (৳)</th>
                  <th style={{ padding: '12px' }}>Total Present</th>
                  <th style={{ padding: '12px' }}>Total Earned</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {workers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '15px', textAlign: 'center', color: '#777' }}>
                      No workers found.
                    </td>
                  </tr>
                ) : (
                  workers.map((worker) => (
                    <tr key={worker.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{worker.name}</td>
                      <td style={{ padding: '12px', color: '#555' }}>{worker.email || worker.phone || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>
                        <input
                          type="number"
                          value={worker.salaryRate}
                          onChange={(e) => handleRateChange(worker.id, e.target.value)}
                          style={{ width: '80px', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                      </td>
                      <td style={{ padding: '12px', color: '#0070f3', fontWeight: 'bold' }}>{worker.totalPresentDays} Days</td>
                      <td style={{ padding: '12px', color: 'green', fontWeight: 'bold' }}>৳ {worker.totalEarned}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => saveSalaryRate(worker.id, worker.salaryRate)}
                          disabled={updatingId === worker.id}
                          style={{
                            background: '#0070f3',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {updatingId === worker.id ? 'Saving...' : 'Update'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}