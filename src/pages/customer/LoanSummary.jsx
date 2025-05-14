import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import Navbar from '../../components/dashboard/Navbar';
import DataTable from 'react-data-table-component';
import { Plus } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

const LoanSummary = () => {
  const { isHovered } = useSidebar();
  const location = useLocation();
  const { customerCode, customerName } = location.state || {};
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const sampleLoans = [
    { id: 1, type: 'Personal Loan', amount: 150000, status: 'Active' },
    { id: 2, type: 'Education Loan', amount: 200000, status: 'Closed' },
    { id: 3, type: 'Vehicle Loan', amount: 500000, status: 'Active' },
  ];

  useEffect(() => {
    setFilteredData(sampleLoans);
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    if (value === '') {
      setFilteredData(sampleLoans);
    } else {
      const filtered = sampleLoans.filter((item) =>
        item.type.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const columns = [
    { name: 'Loan Type', selector: (row) => row.type, sortable: true },
    { name: 'Amount', selector: (row) => `Rs. ${row.amount.toLocaleString()}`, sortable: true },
    { name: 'Status', selector: (row) => row.status, sortable: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />
      <div className={`flex-1 transition-all duration-300 ${isHovered ? 'ml-64' : 'ml-20'}`}>
        <Navbar />
        <div className="p-6 mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Loan Summary - {customerName} ({customerCode})
            </h2>
          </div>

          <div className="mb-4 flex justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Search loan type..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 px-3 py-1 rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 flex items-center gap-2 text-sm">
              <Plus size={18} />
              Add Loan
            </button>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            responsive
            selectableRows
            customStyles={{
    headRow: {
      style: {
        minHeight: '40px', 
      },
    },
    headCells: {
      style: {
        backgroundColor: '#0fcea0',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '14px',
        paddingTop: '8px',
        paddingBottom: '8px',
        textTransform:"uppercase"
      },
    },
    rows: {
      style: {
        minHeight: '40px', 
        paddingTop: '0px',
        paddingBottom: '0px',
      },
    },
    cells: {
      style: {
        fontSize: '14px', 
        paddingTop: '8px',
        paddingBottom: '8px',
         },
     },
    }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoanSummary;
