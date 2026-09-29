'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerDashboard() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Selected worker for viewing history
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerHistory, setWorkerHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Date state for filtering date-wise present workers (YYYY-MM-DD format)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const router = useRouter();

  // Security check
  useEffect(() => {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (!userId || role !== 'OWNER') {
      alert('Unauthorized access! Please login as an Owner.');
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  async function fetchWorkersData() {
    try {
      const res = await fetch('/api/owner/workers-attendance');
      const data = await res.json();
      if (res.ok) {
        let rawWorkers = [];

        // Flexible check to support multiple backend data structures
        if (Array.isArray(data)) {
          rawWorkers = data;
        } else if (data.workers && Array.isArray(data.workers)) {
          rawWorkers = data.workers;
        } else if (data.attendances && Array.isArray(data.attendances)) {
          // Group attendances by worker if returned as flat attendance list
          const workerMap = {};
          data.attendances.forEach(att => {
            const user = att.user || att;
            const userId = user.id || user.phone || user._id;
            if (!userId) return;
            
            if (!workerMap[userId]) {
              workerMap[userId] = {
                ...user,
                id: userId,
                salaryRate: Number(user.salaryRate) || 500,
                attendances: []
              };
            }
            workerMap[userId].attendances.push(att);
          });
          rawWorkers = Object.values(workerMap);
        }

        const formattedWorkers = rawWorkers.map(w => {
          const attendancesList = w.attendances || [];
          const presentDays = attendancesList.length > 0 ? attendancesList.length : (Number(w.totalPresentDays) || 0);
          const rate = Number(w.salaryRate) || 500;
          return {
            ...w,
            id: w.id || w.userId || w._id,
            name: w.name || 'Unknown Worker',
            salaryRate: rate,
            totalPresentDays: presentDays,
            totalEarned: presentDays * rate,
            attendances: attendancesList
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
    setWorkers(workers.map(worker => {
      if (worker.id === id) {
        const rateNum = newRate === '' ? '' : Number(newRate);
        return { 
          ...worker, 
          salaryRate: newRate, 
          totalEarned: (typeof rateNum === 'number' && !isNaN(rateNum) ? rateNum : 0) * worker.totalPresentDays 
        };
      }
      return worker;
    }));
  };

  const saveSalaryRate = async (id, salaryRate) => {
    const rateNumber = Number(salaryRate);
    if (isNaN(rateNumber) || rateNumber < 0) {
      alert('Please enter a valid salary rate.');
      return;
    }

    setUpdatingId(id);
    try {
      const res = await fetch('/api/owner/update-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, salaryRate: rateNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Salary rate updated successfully!');
        fetchWorkersData();
      } else {
        alert('Failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating salary rate', err);
      alert('An error occurred.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Function to fetch specific worker's attendance history
  const fetchWorkerHistory = async (worker) => {
    setSelectedWorker(worker);
    setHistoryLoading(true);
    try {
      const workerIdToFetch = worker.phone || worker.id;
      const res = await fetch(`/api/attendance/history?workerId=${workerIdToFetch}`);
      const data = await res.json();
      
      if (data.success && data.data) {
        setWorkerHistory(data.data);
      } else if (Array.isArray(data)) {
        setWorkerHistory(data);
      } else {
        setWorkerHistory(data.history || data.attendances || []);
      }
    } catch (err) {
      console.error('Error fetching worker history', err);
      setWorkerHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const totalWorkersCount = workers.length;

  // Selected date-er sathe worker-der attendance match kore count ber kora hocche
  const presentWorkersOnSelectedDate = workers.filter(worker => {
    if (!worker.attendances || !Array.isArray(worker.attendances)) return false;
    return worker.attendances.some(att => {
      const attRawDate = att.date || att.createdAt || att.timestamp;
      if (!attRawDate) return false;
      
      const attDateObj = new Date(attRawDate);
      if (isNaN(attDateObj.getTime())) {
        return String(attRawDate).includes(selectedDate);
      }
      
      const year = attDateObj.getFullYear();
      const month = String(attDateObj.getMonth() + 1).padStart(2, '0');
      const day = String(attDateObj.getDate()).padStart(2, '0');
      const formattedAttDate = `${year}-${month}-${day}`;

      return formattedAttDate === selectedDate;
    });
  }).length;

  const grandTotalPayroll = workers.reduce((acc, curr) => acc + (Number(curr.totalEarned) || 0), 0);

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto', fontFamily: 'sans-serif' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: '#6c757d',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ← Back to Home
        </button>

        <button
          onClick={handleLogout}
          style={{
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Logout 🚪
        </button>
      </div>

      <h2>👑 Owner Dashboard - Workers Summary & Salary Management</h2>
      <p style={{ color: '#555' }}>Monitor attendance and manage company-wide payroll easily:</p>

      {loading ? (
        <p>Loading summary...</p>
      ) : (
        <>
          {/* Date Selector Filter */}
          <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label htmlFor="attendance-date" style={{ fontWeight: 'bold', color: '#334155', fontSize: '14px' }}>
              📅 Select Attendance Date:
            </label>
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '14px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>(Card count will update based on this selected date)</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', background: '#f0f4f8', padding: '20px', borderRadius: '8px', border: '1px solid #d9e2ec' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#334e68' }}>Total Workers</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#102a43' }}>{totalWorkersCount}</p>
            </div>
            <div style={{ flex: 1, minWidth: '200px', background: '#e3fcef', padding: '20px', borderRadius: '8px', border: '1px solid #abf5d1' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#067647' }}>Present on {selectedDate}</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#027a48' }}>{presentWorkersOnSelectedDate} Workers</p>
            </div>
            <div style={{ flex: 1, minWidth: '200px', background: '#eef2ff', padding: '20px', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#3730a3' }}>Grand Total Payroll</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#312e81' }}>৳ {grandTotalPayroll}</p>
            </div>
          </div>

          <div style={{ marginTop: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ background: '#f4f4f4', borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Worker Name</th>
                  <th style={{ padding: '12px' }}>Email / Phone</th>
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
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => saveSalaryRate(worker.id, worker.salaryRate)}
                            disabled={updatingId === worker.id}
                            style={{
                              background: '#0070f3',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            {updatingId === worker.id ? 'Saving...' : 'Update'}
                          </button>
                          <button
                            onClick={() => fetchWorkerHistory(worker)}
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            View History
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Worker Attendance History Section */}
          {selectedWorker && (
            <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Attendance History: {selectedWorker.name}</h3>
                <button
                  onClick={() => setSelectedWorker(null)}
                  style={{ background: '#64748b', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Close X
                </button>
              </div>

              {historyLoading ? (
                <p>Loading attendance history...</p>
              ) : workerHistory.length === 0 ? (
                <p style={{ color: '#64748b' }}>No attendance records found for {selectedWorker.name}.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e2e8f0' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>Date</th>
                      <th style={{ padding: '10px' }}>Time</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Selfie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workerHistory.map((h, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px' }}>{h.date || 'N/A'}</td>
                        <td style={{ padding: '10px', color: '#555' }}>{h.time || 'N/A'}</td>
                        <td style={{ padding: '10px', color: '#10b981', fontWeight: 'bold' }}>{h.status || 'Present'}</td>
                        <td style={{ padding: '10px' }}>
                          {h.image ? (
                            <img src={h.image} alt="Selfie" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc' }} />
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}