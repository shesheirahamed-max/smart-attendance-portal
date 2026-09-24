'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', role: 'WORKER' });
  const [message, setMessage] = useState('');

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
      setMessage('✅ Success: User Registered Successfully!');
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Register User</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Full Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        <input type="text" placeholder="Phone Number" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        <select onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
          <option value="WORKER">Worker</option>
          <option value="OWNER">Owner</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {message && <p style={{ marginTop: '15px' }}>{message}</p>}
    </div>
  );
}