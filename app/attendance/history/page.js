'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AttendancePage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerId, setWorkerId] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('manual');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let storedId = localStorage.getItem('userId');
    let storedName = localStorage.getItem('userName') || '';

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (!storedId) storedId = userObj.phone || userObj.id || userObj.userId;
        if (!storedName) storedName = userObj.name || userObj.username || '';
      } catch (e) {}
    }

    if (storedId) setWorkerId(storedId);
    if (storedName) setName(storedName);

    fetch('/api/attendance/history')
      .then((res) => res.json())
      .then((data) => {
        let records = [];
        if (Array.isArray(data)) records = data;
        else if (data.success && Array.isArray(data.data)) records = data.data;
        else if (data.attendances && Array.isArray(data.attendances)) records = data.attendances;

        if (storedId) {
          const workerRecords = records.filter(
            (item) => item.workerId == storedId || item.userId == storedId
          );
          setHistory(workerRecords);
        } else {
          setHistory(records);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const startCamera = async () => {
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Camera permission denied or not available.');
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);

      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workerId) {
      alert('Worker ID not found. Please login first.');
      router.push('/login');
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: workerId,
          workerId: workerId,
          name: name,
          image: image,
          status: 'PRESENT',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Attendance submitted successfully!');
        window.location.reload();
      } else {
        setMessage(data.error || 'Failed to submit attendance.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Attendance System & History
      </h1>

      {message && (
        <p style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '15px' }}>
          {message}
        </p>
      )}

      <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #cce5ff' }}>
        <h3 style={{ marginTop: 0, color: '#004085' }}>Give Attendance (Manual & Camera Mode)</h3>
        
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setMode('manual')}
            style={{ padding: '8px 15px', background: mode === 'manual' ? '#0070f3' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Manual Mode
          </button>
          <button
            type="button"
            onClick={startCamera}
            style={{ padding: '8px 15px', background: mode === 'camera' ? '#0070f3' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Camera Mode
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Worker ID (Mobile Number):</label>
            <input
              type="text"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {mode === 'camera' && (
            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
              <div style={{ marginBottom: '10px' }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '320px', borderRadius: '6px', background: '#000' }}></video>
              </div>
              <button
                type="button"
                onClick={captureImage}
                style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Capture Photo
              </button>
              <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

              {image && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '12px', color: 'green', fontWeight: 'bold' }}>Photo captured successfully</p>
                  <img src={image} alt="Captured" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #28a745' }} />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{ background: '#0070f3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
          >
            {submitting ? 'Submitting...' : 'Submit Attendance Now'}
          </button>
        </form>
      </div>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3 style={{ marginTop: 0 }}>Attendance History</h3>
        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No attendance records found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#0070f3', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date & Time</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Worker ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '14px' }}>
                    {new Date(item.createdAt || item.date || item.checkIn).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '14px' }}>{item.workerId || item.userId || 'N/A'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '14px' }}>{item.name || 'N/A'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', color: 'green', fontWeight: 'bold', fontSize: '14px' }}>
                    PRESENT
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '25px' }}>
        <a href="/worker/dashboard" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Worker Dashboard
        </a>
      </div>
    </div>
  );
}