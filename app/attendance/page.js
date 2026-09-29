'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AttendancePage() {
  const [workerId, setWorkerId] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let storedId = '';
    let storedName = '';

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        storedId = userObj.phone || userObj.id || userObj.userId || '';
        storedName = userObj.name || userObj.username || '';
      } catch (e) {}
    }

    if (!storedId) {
      storedId = localStorage.getItem('phone') || localStorage.getItem('userPhone') || localStorage.getItem('userId') || '';
    }
    if (!storedName) {
      storedName = localStorage.getItem('userName') || '';
    }

    if (storedId) setWorkerId(storedId);
    if (storedName) setName(storedName);

    // ক্যামেরা চালু করার কোড
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log('Camera error:', err);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 300;
    canvas.height = video.videoHeight || 200;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImage(dataUrl);
    alert('Picture captured successfully! 📸');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/attendance/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, name, image }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Attendance submitted successfully! ✅');
        router.push('/worker/dashboard');
      } else {
        setMessage(data.message || 'Failed to submit attendance.');
      }
    } catch (err) {
      setMessage('Server connection error during attendance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>হাজিরা প্রদান সিস্টেম (Attendance System)</h2>

      {message && (
        <p style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '15px' }}>
          {message}
        </p>
      )}

      <div style={{ background: '#f0f7ff', padding: '25px', borderRadius: '8px', border: '1px solid #b3d7ff' }}>
        <h3 style={{ marginTop: 0, fontSize: '18px', color: '#004085' }}>Give Attendance (Picture & Manual Check-in)</h3>
        
        {/* ক্যামেরা প্রিভিউ সেクション */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', background: '#000' }}></video>
          <div style={{ marginTop: '10px' }}>
            <button type="button" onClick={capturePhoto} style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Capture Photo 📷
            </button>
          </div>
          {image && <p style={{ color: 'green', fontSize: '14px', marginTop: '5px' }}>Image captured! ✔️</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>কর্মী আইডি (Worker ID / Mobile):</label>
            <input
              type="text"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', background: '#fff', fontSize: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>কর্মীর নাম (Name):</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', background: '#fff', fontSize: '15px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#0070f3', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Submitting...' : 'হাজিরা সাবমিট করুন ✅'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '25px' }}>
        <a href="/worker/dashboard" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Worker Dashboard
        </a>
      </div>
    </div>
  );
}