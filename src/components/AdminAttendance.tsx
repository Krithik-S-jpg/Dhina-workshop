import React, { useState, useEffect } from 'react';
import { Users, Trash2, UserPlus, Calendar } from 'lucide-react';
import { Employee, AttendanceRecord } from '../types';
import { supabase } from '../supabaseClient';

interface AdminAttendanceProps {
  employees: Employee[];
  onUpdateEmployees: () => void;
}

export function AdminAttendance({ employees, onUpdateEmployees }: AdminAttendanceProps) {
  const [activeTab, setActiveTab] = useState<'staff' | 'logs'>('staff');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchAttendanceLogs();
    }
  }, [activeTab, selectedDate]);

  const fetchAttendanceLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance')
      .select('*, employees(name)')
      .eq('date', selectedDate)
      .order('time', { ascending: false });

    if (error) {
      console.error('Error fetching attendance:', error);
    } else {
      const formattedData = data.map((record: any) => ({
        ...record,
        employee_name: record.employees?.name || 'Unknown'
      }));
      setAttendanceLogs(formattedData);
    }
    setLoading(false);
  };

  const handleAddEmployee = async () => {
    if (!newEmployeeName.trim()) return;

    const { error } = await supabase.from('employees').insert([
      { name: newEmployeeName.trim(), role: 'staff' }
    ]);

    if (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee');
    } else {
      setNewEmployeeName('');
      onUpdateEmployees();
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee? This will delete all their attendance records too.')) return;

    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    } else {
      onUpdateEmployees();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'staff'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Staff Management
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'logs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Attendance Logs
        </button>
      </div>

      {activeTab === 'staff' ? (
        <div>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter new employee name"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddEmployee}
              disabled={!newEmployeeName.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Person
            </button>
          </div>

          <div className="overflow-hidden border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No employees added yet.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">{emp.role}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">Select Date:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-hidden border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : attendanceLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No attendance records found for this date.
                    </td>
                  </tr>
                ) : (
                  attendanceLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{log.time}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{log.employee_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 uppercase">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
