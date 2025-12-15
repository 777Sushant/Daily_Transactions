import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, User } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function KhataBook() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'credit',
    amount: '',
    party: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('khataTransactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('khataTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!formData.amount || !formData.party) return;
    
    const newTransaction = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      timestamp: new Date().toISOString()
    };
    setTransactions([newTransaction, ...transactions]);
    setFormData({
      type: 'credit',
      amount: '',
      party: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transactions.map(t => ({
      Date: t.date,
      Type: t.type.toUpperCase(),
      Party: t.party,
      Amount: t.amount,
      Description: t.description
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `KhataBook_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalCredit - totalDebit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-0 left-0"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-0 right-0 animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-1/2 left-1/2 animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            📒 Khata Book
          </h1>
          <p className="text-blue-200 text-lg">Manage your daily transactions effortlessly</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm mb-1">Total Credit</p>
                <p className="text-3xl font-bold text-white">₹{totalCredit.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-green-400" size={40} />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm mb-1">Total Debit</p>
                <p className="text-3xl font-bold text-white">₹{totalDebit.toFixed(2)}</p>
              </div>
              <TrendingDown className="text-red-400" size={40} />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm mb-1">Balance</p>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{balance.toFixed(2)}
                </p>
              </div>
              <DollarSign className="text-yellow-400" size={40} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            Add Transaction
          </button>
          
          <button
            onClick={exportToExcel}
            disabled={transactions.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            Export to Excel
          </button>

          <div className="flex gap-2 ml-auto">
            {['all', 'credit', 'debit'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Add Transaction Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Add New Transaction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2 font-medium">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="credit" className="text-gray-900">Credit (Money In)</option>
                  <option value="debit" className="text-gray-900">Debit (Money Out)</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Party Name</label>
                <input
                  type="text"
                  value={formData.party}
                  onChange={(e) => setFormData({...formData, party: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50"
                  placeholder="Customer/Supplier name"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white mb-2 font-medium">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50"
                  placeholder="Transaction details"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  onClick={addTransaction}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                >
                  Save Transaction
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 bg-white/20 text-white py-3 rounded-lg font-semibold hover:bg-white/30 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4">Transaction History</h3>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto text-white/50 mb-4" size={64} />
              <p className="text-white/70 text-lg">No transactions yet. Add your first transaction!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map(t => (
                <div
                  key={t.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          t.type === 'credit' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {t.type === 'credit' ? '↑ IN' : '↓ OUT'}
                        </span>
                        <span className="text-white font-bold text-xl">
                          ₹{t.amount.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span className="font-medium">{t.party}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{new Date(t.date).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                      
                      {t.description && (
                        <p className="text-white/70 mt-2 text-sm">{t.description}</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/40 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}