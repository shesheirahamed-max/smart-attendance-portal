'use client';
import { useState, useEffect } from 'react';

export default function WorkersManagementPage() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    salaryRate: '500'
  });
  const [submitting, setSubmitting] = useState(false);

  async function fetchWorkers() {
    try {
      const res = await fetch('/api/owner/workers-attendance');
      const data = await res.json();
      if (res.ok) {
        setWorkers(data.workers || []);
      }
    } catch (err) {
      console.error('Error fetching workers:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleAddWorker = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/owner/add-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Worker added successfully!');
        setFormData({ name: '', email: '', phone: '', password: '', salaryRate: '500' });
        fetchWorkers();
      } else {
        alert('Failed: ' + (data.error || 'Something went wrong'));
      }
    } catch (err) {
      console.error('Error adding worker:', err);
      alert('An error occurred while adding worker.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>👷‍♂️ Worker Management - Add & Monitor Workers</h2>
      <p style={{ color: '#555', marginBottom: '30px' }}>Add new workers to the system and view their details below.</p>

      <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '40px' }}>
        <h3 style={{ marginTop: 0, color: '#1e293b' }}>Add New Worker</h3>
        <form onSubmit={handleAddWorker} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahim Ahmed"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Phone Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. 017xxxxxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Email (Optional)</label>
            <input
              type="email"
              placeholder="worker@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Password *</label>
            <input
              type="password"
              required
              placeholder="Password for login"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Daily Rate (৳)</label>
            <input
              type="number"
              value={formData.salaryRate}
              onChange={(e) => setFormData({ ...formData, salaryRate: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                padding: '11px 20px',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {submitting ? 'Adding...' : '+ Add Worker'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 style={{ color: '#1e293b' }}>All Workers List ({workers.length})</h3>
        {loading ? (
          <p>Loading workers...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Phone</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Daily Rate</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {workers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                      No workers found. Add your first worker using the form above!
                    </td>
                  </tr>
                ) : (
                  workers.map((worker) => (
                    <tr key={worker.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#334155' }}>{worker.name}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{worker.phone || 'N/A'}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{worker.email || 'N/A'}</td>
                      <td style={{ padding: '12px', color: '#059669', fontWeight: 'bold' }}>৳ {worker.salaryRate || 500}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}