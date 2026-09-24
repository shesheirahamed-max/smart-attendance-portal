'use client';
import Link from 'next/link';

export default function OwnerDashboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">মালিক বা ওনার প্যানেল (Owner Panel)</h1>
      <p className="text-gray-600 mb-8">প্রতিষ্ঠানের সামগ্রিক ব্যবস্থাপনা, কর্মী তালিকা ও পে-রোল এখানে পরিচালনা করুন।</p>

      {/* কার্ড বা শর্টকাট সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ড্যাশবোর্ড কার্ড */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">ওভারভিউ ড্যাশবোর্ড</h2>
          <p className="text-gray-500 text-sm mb-4">সার্বিক কার্যক্রমের সংক্ষিপ্ত বিবরণ ও পরিসংখ্যান দেখুন।</p>
          <Link href="/owner/dashboard" className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
            ড্যাশবোর্ডে যান
          </Link>
        </div>

        {/* কর্মী ম্যানেজমেন্ট কার্ড */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-green-600">কর্মী তালিকা (Workers)</h2>
          <p className="text-gray-500 text-sm mb-4">সকল কর্মীদের তালিকা এবং তাদের তথ্য পরিচালনা করুন।</p>
          <Link href="/owner/workers" className="inline-block bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">
            কর্মী তালিকা দেখুন
          </Link>
        </div>

        {/* পে-রোল কার্ড */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-purple-600">বেতন বা পে-রোল (Payroll)</h2>
          <p className="text-gray-500 text-sm mb-4">কর্মীদের বেতন-ভাতা এবং আর্থিক হিস্ট্রি ম্যানেজ করুন।</p>
          <Link href="/owner/payroll" className="inline-block bg-purple-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-700">
            পে-রোল ম্যানেজ করুন
          </Link>
        </div>

      </div>
    </div>
  );
}