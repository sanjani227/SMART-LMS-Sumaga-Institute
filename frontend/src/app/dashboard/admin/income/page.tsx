'use client';

import { ArrowUpRight, ArrowDownRight, Wallet, Download, PieChart } from 'lucide-react';

export default function IncomeOverview() {
  const monthlyData = [
    { month: 'January', income: 'Rs12,000', expenses: 'RS10,000', profit: 'Rs2,000' },
    { month: 'February', income: 'Rs12,500', expenses: 'RS9,800', profit: 'RS2,700' },
    { month: 'March', income: 'Rs13,000', expenses: 'RS11,000', profit: 'RS2,000' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Income Overview</h2>
        <p className="text-gray-400 text-sm">Financial overview and income analysis for the institute.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><ArrowUpRight size={24}/></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Income</span>
          </div>
          <p className="text-3xl font-black text-gray-800">RS. 281,600</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><ArrowDownRight size={24}/></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Expenses</span>
          </div>
          <p className="text-3xl font-black text-gray-800">RS. 209,900</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Wallet size={24}/></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Profit</span>
          </div>
          <p className="text-3xl font-black text-gray-800">RS. 71,700</p>
        </div>
      </div>

      {/* Income & Expenses Chart Placeholder */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-80 flex flex-col items-center justify-center text-center">
         <div className="mb-4 flex items-center gap-2 text-orange-500 font-bold">
            <PieChart size={20}/>
            <span>Income & Expenses Visualization</span>
         </div>
         <div className="w-full max-w-2xl h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
            [Chart Area: Install 'recharts' to render live graphs]
         </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Detailed Income Breakdown</h3>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-orange-700 transition">
            <Download size={16}/> Export
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            <tr>
              <th className="px-8 py-4">Month</th>
              <th className="px-8 py-4">Total Income</th>
              <th className="px-8 py-4">Expenses</th>
              <th className="px-8 py-4 text-right">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {monthlyData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="px-8 py-4 text-gray-800 font-medium">{row.month}</td>
                <td className="px-8 py-4 text-gray-600">{row.income}</td>
                <td className="px-8 py-4 text-red-500">{row.expenses}</td>
                <td className="px-8 py-4 text-right text-green-600 font-bold">{row.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
