'use client';

import { Filter, Download, BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-4 px-2 py-2">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <p className="text-gray-400 text-sm">Generate and view reports for attendance, performance, and financial data.</p>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mx-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Report Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Report Type</label>
            <select className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-200 outline-none transition cursor-pointer">
              <option>Attendance Report</option>
              <option>Financial Report</option>
              <option>Student Performance</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Range</label>
            <select className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-200 outline-none transition cursor-pointer">
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Custom Range</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Grade</label>
            <select className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-200 outline-none transition cursor-pointer">
              <option>All Grades</option>
              <option>Grade 8</option>
              <option>Grade 9</option>
              <option>Grade 10</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button className="flex items-center gap-2 text-gray-500 font-semibold px-4 py-2 hover:bg-gray-50 rounded-lg transition">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-sm">
            <BarChart3 size={18} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mx-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Report Preview</h3>
          <button className="flex items-center gap-2 text-orange-600 font-semibold px-4 py-2 hover:bg-orange-50 rounded-lg transition">
            <Download size={18} />
            Download PDF
          </button>
        </div>
        
        <div className="text-center py-20 text-gray-400">
          <BarChart3 size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select filters and generate a report to view results</p>
        </div>
      </div>
    </div>
  );
}
