'use client';
import { useState, useEffect } from 'react';

export default function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance/history')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data);
        } else if (data.success && Array.isArray(data.data)) {
          setHistory(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-center">লোডিং হচ্ছে...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4 text-center">হাজিরা ইতিহাস (Attendance History)</h1>
      {history.length === 0 ? (
        <p className="text-center text-gray-500">কোনো হাজিরা পাওয়া যায়নি।</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">তারিখ ও সময়</th>
              <th className="border p-2">কর্মী আইডি</th>
              <th className="border p-2">নাম</th>
              <th className="border p-2">ছবি</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{new Date(item.createdAt || item.date).toLocaleString()}</td>
                <td className="border p-2">{item.workerId || 'N/A'}</td>
                <td className="border p-2">{item.name || 'N/A'}</td>
                <td className="border p-2 flex justify-center">
                  {item.image ? (
                    <img src={item.image} alt="Selfie" className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400 text-sm">ম্যানুয়াল এন্ট্রি (ছবি নেই)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}