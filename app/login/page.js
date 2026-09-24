'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'লগইন ব্যর্থ হয়েছে!');
        return;
      }

      // টোকেন এবং ইউজার ইনফো লোকাল স্টোরেজে সেভ করা
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      alert('লগইন সফল হয়েছে!');

      // রোল চেক করে ড্যাশবোর্ডে রিডাইরেক্ট করা
      if (data.user.role === 'OWNER') {
        window.location.href = '/owner/dashboard'; // ওনার ড্যাশবোর্ড
      } else {
        window.location.href = '/worker/dashboard';  // ওয়ার্কার ড্যাশবোর্ড
      }

    } catch (err) {
      console.error('Login error:', err);
      alert('কোথাও কোনো সমস্যা হয়েছে!');
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>লগইন করুন</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>ফোন নম্বর:</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>পাসওয়ার্ড:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}>
          লগইন
        </button>
      </form>
    </div>
  );
}