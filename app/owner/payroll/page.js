'use client';
import { useState, useEffect } from 'react';

export default function OwnerPayrollPage() {
  const [workers, setWorkers] = useState([]);
  const [month, setMonth] = useState('September');
  const [year, setYear] = useState('2026');
  const [loading, setLoading] = useState(false);

  // ওয়ার্কার এবং তাদের বেতনের তালিকা ফেচ করার ফাংশন
  const fetchPayrollData = async () => {
    try {
      const res = await fetch(`/api/owner/workers-attendance?month=${month}&year=${year}`);
      const data = await res.json();
      if (res.ok) {
        setWorkers(data.workers || []);
      }
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [month, year]);

  // বেতন পরিশোধ করার ফাংশন (Paid করা)
  const handlePaySalary = async (workerId, amount) => {
    if (!confirm(`আপনি কি নিশ্চিতভাবে এই কর্মীকে ${amount} টাকা বেতন পরিশোধ করতে চান?`)) return;

    try {
      setLoading(true);
      const res = await fetch('/api/salary/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, month, year, amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'বেতন পরিশোধ করতে সমস্যা হয়েছে!');
        return;
      }

      alert('সফলভাবে বেতন পরিশোধ করা হয়েছে!');
      fetchPayrollData(); // ডাটা রিফ্রেশ করা
    } catch (error) {
      console.error('Payment error:', error);
      alert('কোথাও কোনো সমস্যা হয়েছে!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>বেতন ব্যবস্থাপনা ও পে-রোল (Payroll Disbursement)</h2>
      
      {/* মাস ও বছর সিলেক্ট করার অপশন */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>মাস:</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold' }}>বছর:</label>
          <input 
            type="text" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            style={{ padding: '7px', width: '100px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
      </div>

      {/* ওয়ার্কারদের ডেটা টেবিল */}
      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>কর্মীর নাম</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>ফোন নম্বর</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>মোট বেতন (টাকা)</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>স্ট্যাটাস</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {workers.length > 0 ? (
              workers.map((worker) => (
                <tr key={worker.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{worker.name}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{worker.phone}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{worker.totalSalary || 0}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '5px 10px', 
                      borderRadius: '4px', 
                      color: '#fff', 
                      background: worker.status === 'PAID' ? 'green' : 'orange',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {worker.status || 'UNPAID'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button 
                      onClick={() => handlePaySalary(worker.id, worker.totalSalary || 0)}
                      disabled={loading || worker.status === 'PAID'}
                      style={{ 
                        padding: '8px 15px', 
                        background: worker.status === 'PAID' ? '#cccccc' : '#0070f3', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: worker.status === 'PAID' ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {worker.status === 'PAID' ? 'পরিশোধিত' : 'বেতন দিন (Pay)'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                  কোনো ওয়ার্কারের তথ্য পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}