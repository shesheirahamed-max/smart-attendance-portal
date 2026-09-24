'use client';
import { useState, useRef } from 'react';

export default function AttendancePage() {
  const [workerId, setWorkerId] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [mode, setMode] = useState('camera'); // 'camera' অথবা 'manual' মোড টগল করার জন্য
  const [message, setMessage] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ক্যামেরা চালু করার ফাংশন
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error: ", err);
      setMessage("ক্যামেরা অন করা যাচ্ছে না!");
    }
  };

  // ছবি তোলার ফাংশন
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setImage(dataUrl);
      setMessage("ছবি সফলভাবে তোলা হয়েছে!");
    }
  };

  // হাজিরা সাবমিট করার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workerId) {
      setMessage("দয়া করে কর্মী আইডি (Worker ID) লিখুন!");
      return;
    }

    if (mode === 'camera' && !image) {
      setMessage("দয়া করে ক্যামেরা দিয়ে ছবি তুলুন অথবা ম্যানুয়াল মোডে যান!");
      return;
    }

    try {
      const res = await fetch('/api/attendance/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          workerId, 
          name: name || 'N/A',
          image: mode === 'camera' ? image : null // ক্যামেরা মোডে ছবি যাবে, ম্যানুয়ালে আসবে না
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage("হাজিরা সফলভাবে জমা হয়েছে!");
        setWorkerId('');
        setName('');
        setImage(null);
      } else {
        setMessage(data.message || "সাবমিট করতে সমস্যা হয়েছে!");
      }
    } catch (err) {
      console.error(err);
      setMessage("সার্ভার ত্রুটি দেখা দিয়েছে!");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4 text-center">হাজিরা প্রদান সিস্টেম</h1>

      {/* মোড সিলেক্ট করার বাটন */}
      <div className="flex justify-center gap-4 mb-6">
        <button 
          type="button" 
          onClick={() => { setMode('camera'); setMessage(''); }}
          className={`px-4 py-2 rounded font-semibold ${mode === 'camera' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          ক্যামেরা মোড (Camera)
        </button>
        <button 
          type="button" 
          onClick={() => { setMode('manual'); setMessage(''); }}
          className={`px-4 py-2 rounded font-semibold ${mode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          ম্যানুয়াল মোড (Manual)
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">কর্মী আইডি (Worker ID):</label>
          <input 
            type="text" 
            value={workerId} 
            onChange={(e) => setWorkerId(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="আপনার আইডি লিখুন"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">কর্মীর নাম (ঐচ্ছিক):</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="আপনার নাম লিখুন"
          />
        </div>

        {/* যদি ক্যামেরা মোড সিলেক্ট করা থাকে */}
        {mode === 'camera' && (
          <div className="mb-4 border p-3 rounded bg-gray-50">
            <video ref={videoRef} autoPlay playsInline className="w-full border rounded mb-2 h-48 bg-black"></video>
            <div className="flex gap-2">
              <button type="button" onClick={startCamera} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">
                ক্যামেরা অন করুন
              </button>
              <button type="button" onClick={captureImage} className="bg-amber-600 text-white px-3 py-1.5 rounded text-sm">
                ছবি তুলুন
              </button>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

            {image && (
              <div className="mt-3">
                <p className="text-sm font-semibold mb-1">তোলা ছবি:</p>
                <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded border" />
              </div>
            )}
          </div>
        )}

        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded w-full font-semibold hover:bg-purple-700">
          হাজিরা সাবমিট করুন
        </button>
      </form>

      {message && <p className="mt-4 font-semibold text-center text-blue-600">{message}</p>}
    </div>
  );
}