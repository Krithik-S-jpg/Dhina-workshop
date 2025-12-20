import React, { useState } from 'react';
import { UserCheck, Clock } from 'lucide-react';
import { Employee } from '../types';
import { supabase } from '../supabaseClient';

interface AttendanceWidgetProps {
  employees: Employee[];
}

export function AttendanceWidget({ employees }: AttendanceWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleMarkAttendance = async () => {
    if (!selectedEmployeeId) return;

    setStatus('loading');
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      // Check if already marked for today (optional, but good practice)
      // For now, we just insert.

      const { error } = await supabase.from('attendance').insert([
        {
          employee_id: selectedEmployeeId,
          date: dateStr,
          time: timeStr,
          status: 'present',
        }
      ]);

      if (error) throw error;

      setStatus('success');
      setMessage(`Marked present at ${timeStr}`);
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setSelectedEmployeeId('');
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error marking attendance:', err);
      setStatus('error');
      setMessage('Failed to mark attendance.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center gap-2"
        title="Mark Attendance"
      >
        <UserCheck className="w-6 h-6" />
        <span className="font-medium">Attendance</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Mark Attendance
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your Name
              </label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            {message && (
              <div className={`mb-4 p-2 rounded text-sm ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAttendance}
                disabled={!selectedEmployeeId || status === 'loading'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'loading' ? 'Marking...' : 'Mark Present'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
