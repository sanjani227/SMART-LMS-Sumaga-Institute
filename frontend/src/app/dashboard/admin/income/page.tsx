'use client';

import { ArrowUpRight, ArrowDownRight, Wallet, Download, PieChart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function IncomeOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlyData: [],
    totalIncome: 0,
    totalExpenses: 0,
    totalProfit: 0
  });

  useEffect(() => {
    fetchIncomeStats();
  }, []);

  const fetchIncomeStats = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("TOKEN");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/income`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.code === 200) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch income stats", error);
    } finally {
      // Add a tiny delay for smooth UI transition
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleExport = () => {
    if (stats.monthlyData.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('SMART LMS - Financial Income Report', 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Profit: Rs. ${stats.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 14, 38);

    const head = [['Month', 'Income', 'Expenses', 'Net Profit']];
    const body = stats.monthlyData.map((row: any) => [
      row.month,
      `Rs. ${row.income.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      `Rs. ${row.expenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      `Rs. ${row.profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    ]);

    autoTable(doc, {
      startY: 45,
      head: head,
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] }, // green-600 tailored for finance
    });

    doc.save(`SmartLMS_Financial_Report_${Date.now()}.pdf`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-green-600" size={32} /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Income Overview</h2>
        <p className="text-gray-400 text-sm">Financial overview and income analysis for the institute.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><ArrowUpRight size={24}/></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Income</span>
          </div>
          <p className="text-3xl font-black text-gray-800">Rs. {stats.totalIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><ArrowDownRight size={24}/></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Expenses</span>
          </div>
          <p className="text-3xl font-black text-gray-800">Rs. {stats.totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Wallet size={24}/></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Profit</span>
          </div>
          <p className="text-3xl font-black text-green-600">Rs. {stats.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Income & Expenses Chart */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
         <div className="mb-6 w-full flex items-center gap-2 text-gray-700 font-bold">
            <PieChart size={20}/>
            <span>Income vs Expenses Trends</span>
         </div>
         <div className="w-full h-[350px]">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={stats.monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                 </linearGradient>
                 <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
               <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 formatter={(value) => [`Rs. ${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, '']}
               />
               <Area type="monotone" dataKey="income" name="Total Income" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
               <Area type="monotone" dataKey="expenses" name="Total Expenses" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
             </AreaChart>
           </ResponsiveContainer>
         </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Detailed Financial Breakdown</h3>
          <button onClick={handleExport} className="bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-700 transition shadow-sm">
            <Download size={16}/> Export PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-widest whitespace-nowrap border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Month</th>
                <th className="px-8 py-5">Total Income</th>
                <th className="px-8 py-5">Expenses</th>
                <th className="px-8 py-5 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.monthlyData.map((row: any, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-8 py-5 text-gray-800 font-medium whitespace-nowrap">{row.month}</td>
                  <td className="px-8 py-5 text-gray-600 whitespace-nowrap">Rs. {row.income.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className="px-8 py-5 text-red-500 whitespace-nowrap">Rs. {row.expenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className="px-8 py-5 text-right text-green-600 font-bold whitespace-nowrap">Rs. {row.profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {stats.monthlyData.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium">No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
