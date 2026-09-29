'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerDashboard() {
  const [worker, setWorker] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let workerData = null;
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        workerData = JSON.parse(storedUser);
      } catch (e) {}
    }

    if (!workerData) {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userPhone = localStorage.getItem('userPhone') || localStorage.getItem('phone');
      if (userId || userPhone) {
        workerData = { id: userId, name: userName || 'Worker', phone: userPhone || userId };
      }
    }

    if (!workerData) {
      router.push('/login');
    } else {
      setWorker(workerData);
      const currentId = workerData.phone || workerData.id || workerData.userId;
      fetchHistory(currentId);
    }
    setLoading(false);
  }, [router]);

  const fetchHistory = async (id) => {
    try {
      const res = await fetch(`/api/attendance/history?workerId=${id}`);
      const result = await res.json();
      if (result.success) {
        setHistory(result.data);
      }
    } catch (err) {
      console.log('Error fetching history:', err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      
      {/* হোম পেজে যাওয়ার বাটন */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ← Back to Home
        </button>
      </div>

      <h2 style={{ color: '#333', marginBottom: '10px' }}>Worker Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '25px' }}>Welcome to your profile dashboard.</p>

      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '25px' }}>
        <h3 style={{ marginTop: 0, color: '#0070f3', borderBottom: '2px solid #0070f3', paddingBottom: '8px', marginBottom: '15px' }}>
          Worker Profile Details
        </h3>
        
        {worker ? (
          <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
            <p style={{ margin: '8px 0' }}><strong>Name:</strong> {worker.name || worker.username || 'N/A'}</p>
            <p style={{ margin: '8px 0' }}><strong>Phone / ID:</strong> {worker.phone || worker.id || worker.userId || 'N/A'}</p>
            <p style={{ margin: '8px 0' }}><strong>Role:</strong> {worker.role || 'WORKER'}</p>
          </div>
        ) : (
          <p style={{ color: 'red' }}>No worker details found.</p>
        )}
      </div>

      <div style={{ background: '#eef6ff', padding: '20px', borderRadius: '8px', border: '1px solid #b3d7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h4 style={{ margin: '0 0 5px 0', color: '#004085' }}>Daily Attendance</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Click here to give attendance with picture.</p>
        </div>
        <a
          href="/attendance"
          style={{ background: '#0070f3', color: 'white', textDecoration: 'none', padding: '10px 18px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold' }}
        >
          Give Attendance Now
        </a>
      </div>

      {/* পার্মানেন্ট হাজিরা হিস্ট্রি সেকশন */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '25px' }}>
        <h3 style={{ marginTop: 0, color: '#333', fontSize: '18px', marginBottom: '15px' }}>Attendance History (হাজিরা তালিকা)</h3>
        {history.length === 0 ? (
          <p style={{ color: '#666', fontSize: '14px' }}>No attendance records found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {history.map((item, index) => (
              <li key={index} style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#28a745' }}>Status: PRESENT ✅</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
                    📅 Date: {item.date} | ⏰ Time: {item.time}
                  </p>
                </div>
                {item.image && (
                  <img src={item.image} alt="Selfie" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc' }} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button
          onClick={() => {
            localStorage.clear();
            router.push('/login');
          }}
          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}