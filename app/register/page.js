'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', role: 'WORKER' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('✅ Success: User Registered Successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd' }}>
      
      {/* Home page e jawar button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold'
          }}
        >
          ← Back to Home
        </button>
      </div>

      <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Register User</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>Full Name:</label>
          <input 
            type="text" 
            placeholder="Enter your full name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>Phone Number:</label>
          <input 
            type="text" 
            placeholder="Enter your phone number" 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>Password:</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>Select Role:</label>
          <select 
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', background: '#fff' }}
          >
            <option value="WORKER">Worker</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}
        >
          Submit
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}