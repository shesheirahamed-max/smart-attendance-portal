'use client';
import Link from 'next/link';

export default function WorkerHomePage() {
  return (
    <div style={{ padding: '50px', maxWidth: '600px', margin: 'auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>👷‍♂️ Worker Portal</h2>
      <p style={{ color: '#555', marginBottom: '30px' }}>
        স্বাগতম! এখান থেকে আপনি আপনার ড্যাশবোর্ড এবং বেতনের হিসাব দেখতে পারবেন।
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link 
          href="/worker/dashboard" 
          style={{ 
            padding: '12px 20px', 
            background: '#0284c7', 
            color: '#fff', 
            textDecoration: 'none', 
            borderRadius: '6px', 
            fontWeight: 'bold' 
          }}
        >
          View Worker Dashboard
        </Link>
        <Link 
          href="/worker/salary" 
          style={{ 
            padding: '12px 20px', 
            background: '#059669', 
            color: '#fff', 
            textDecoration: 'none', 
            borderRadius: '6px', 
            fontWeight: 'bold' 
          }}
        >
          View Salary Details
        </Link>
      </div>
    </div>
  );
}