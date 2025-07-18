import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import Navbar from '../../components/dashboard/Navbar';
import DataTable from 'react-data-table-component';
import { useSidebar } from '../../context/SidebarContext';
import SidePopup from '../../components/dashboard/common/SidePopup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../components/api'

const Finance = () => {
  const { isHovered } = useSidebar();
  const location = useLocation();
  const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [downloading, setDownloading] = useState(false);
  const { customerCode, customerName } = location.state || {};
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
   const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
   const [selectedIncomeId, setSelectedIncomeId] = useState(null); 
const [isIncomePopupOpen, setIsIncomePopupOpen] = useState(false);
const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
const [selectedPaymentId, setSelectedPaymentId] = useState(null);
 const [IncomeToDelete, setIncomeToDelete] = useState(null);
const [isPaymentDeletePopupOpen, setIsPaymentDeletePopupOpen] = useState(false);
const [paymentToDelete, setPaymentToDelete] = useState(null);
const [selectedYear, setSelectedYear] = useState('');
const [selectedMonth, setSelectedMonth] = useState('');
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
const months = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' },   { value: '04', label: 'April' },
  { value: '05', label: 'May' },     { value: '06', label: 'June' },
  { value: '07', label: 'July' },    { value: '08', label: 'August' },
  { value: '09', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' },  { value: '12', label: 'December' },
];
  const formatCurrency = (num) => {
  if (isNaN(num)) return '0.00';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
useEffect(() => {
  if (search.trim() === '') {
    setFilteredData(data);
  } else {
    const lowerSearch = search.toLowerCase();
    const filtered = data.filter(item =>
      item.IncomeName.toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
  }
}, [search, data]);

  useEffect(() => {
    fetchIncomes();
    
  }, []);
  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/income/getAll',{
      params: { customerCode } 
        
      });
      setData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
   useEffect(() => {
    fetchPayments();
    
  }, []);
     const fetchPayments = async () => {
  try {
    const response = await api.get('/expenses/getAll', {
      params: { customerCode }
    });
    setPaymentData(response.data);
  } catch (err) {
    toast.error("Failed to load Expenses Transactions");
  }
};
const handleDeletePayment = (id) => {
  setPaymentToDelete(id);
  setIsPaymentDeletePopupOpen(true);
};
console.log(location.state);
const confirmDeletePayment = async () => {
  if (!paymentToDelete) return;

  try {
    await api.delete(`/income/delete/${paymentToDelete}`);
    toast.success("Payment deleted successfully");
    fetchPayments();
  } catch (err) {
    toast.error("Failed to delete payment");
  } finally {
    setIsPaymentDeletePopupOpen(false);
    setPaymentToDelete(null);
  }
};
const handleEditPayment = (payment) => {
  setSelectedPaymentId(payment._id);
  setIsPaymentPopupOpen(true);
  setIsEditMode(true);

  const formattedDate = new Date(payment.date).toISOString().slice(0, 10);

  setPaymentValue('PaymentAmount', payment.amount); 
  setPaymentValue('paymentDate', formattedDate);
};

  const handleEdit = (row) => {
      setIsEditMode(true);                   
      setSelectedIncomeId(row._id);         
      setIsIncomePopupOpen(true);                  
    
      // Prefill data
       const dateObj = new Date(row.date);
  const formattedDate = dateObj.toISOString().slice(0, 10); 

      setIncomeValue('name', row.name);
       setIncomeValue('amount', row.amount);
       setIncomeValue('date', formattedDate);
      
      
    };
const handleDelete = (id) => {
  setIncomeToDelete(id);
  setIsDeletePopupOpen(true);
};
const confirmDelete = async () => {
  if (!IncomeToDelete) return;
  try {
    await api.delete(`/income/delete/${IncomeToDelete}`);
    toast.success("Income deleted successfully");
    fetchIncomes();
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete Income");
  } finally {
    setIsDeletePopupOpen(false);
    setIncomeToDelete(null);
  }
};

  const IncomeSchema = yup.object().shape({
  name: yup.string().required('Income name is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required('Amount is required'),
  date: yup.string().required('Date is required'),
  remarks: yup.string()
});

const paymentSchema = yup.object().shape({
  PaymentAmount: yup
    .number()
    .typeError('Amount must be a number')
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required('Payment amount is required'),
  paymentDate: yup.string().required('Payment date is required')
});
 const {
  register: registerIncome,
  handleSubmit: handleSubmitIncome,
  reset: resetIncome,
  setValue: setIncomeValue,
  formState: { errors: IncomeErrors }
} = useForm({ resolver: yupResolver(IncomeSchema) });

const {
  register: registerPayment,
  handleSubmit: handleSubmitPayment,
  reset: resetPayment,
  setValue: setPaymentValue, 
  formState: { errors: paymentErrors }
} = useForm({ resolver: yupResolver(paymentSchema) });



useEffect(() => { fetchPayments(); }, [customerCode, isPaymentPopupOpen]);


const onSubmit = async (data) => {
  if (isPaymentPopupOpen) {
    try {
    if (selectedPaymentId) {
      await axios.put(`/api/paymentUpdate/${selectedPaymentId}`, {
        customerCode,
        amount: data.PaymentAmount,
        date: data.paymentDate,
      });
      toast.success("Payment updated");
    } else {
      await api.post('/expenses', {
        customerCode,
        amount: data.PaymentAmount,
        date: data.paymentDate,
      });
      toast.success("Payment added");
    }

    setIsPaymentPopupOpen(false);
    setSelectedPaymentId(null);
    fetchPayments();
    resetPayment();
  } catch (err) {
    toast.error("Failed to save payment");
  }
  return;
}

    const IncomeData = {
      name:data.name,
      date:data.date,
      amount:data.amount,
      
    };
  try {
      if (isEditMode) {
       
        await api.put(`/income/update/${selectedIncomeId}`, IncomeData);
  
        toast.success('Income updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await api.post('/income', IncomeData);
  
        toast.success('Income created successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
  
      setIsIncomePopupOpen(false);
      setIsEditMode(false);
      fetchIncomes();  
      resetIncome();           
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to create or update Incomes!', {
        position: "top-center",
        autoClose: false,
      });
    }
  };
  
 const onSubmitIncome = (data) => onSubmit(data);
const onSubmitPayment = (data) => onSubmit(data);


  const incomeColumns = [
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Date', selector: (row) => new Date(row.date).toLocaleDateString(), sortable: true },
   { name: 'Amount', selector: (row) => `Rs. ${formatCurrency(row.amount)}`, sortable: true },
    
     {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
      ignoreRowClick: true,   
    }
  ];

  const expenseColumns = [
    { name: 'Payment Date', selector: (row) => new Date(row.date).toLocaleDateString('en-CA'), sortable: true },
    { name: 'Amount', selector: (row) => `Rs. ${formatCurrency(row.amount)}`, sortable: true, },
    {
  name: "Action",
  cell: (row) => (
    <div className="flex gap-2">
      <button onClick={() => handleEditPayment(row)} className="text-blue-500 hover:text-blue-700">
        <Pencil size={16} />
      </button>
      <button onClick={() => handleDeletePayment(row._id)} className="text-red-500 hover:text-red-700">
        <Trash2 size={16} />
      </button>
    </div>
  ),
  ignoreRowClick: true,
}
  ];

 const totalIncomeAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalPaidAmount = paymentData.reduce((sum, item) => sum + item.amount, 0);
  const remainingAmount = totalIncomeAmount - totalPaidAmount;
  const handleSearch = (value) => {
  setSearch(value);
  if (!value.trim()) {
    setFilteredData(data);
  } else {
    const filtered = data.filter((item) =>
      item.IncomeName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  }
};
useEffect(() => {
  const filtered = data.filter((item) => {
    const date = new Date(item.date);
    const yearMatch = selectedYear ? date.getFullYear().toString() === selectedYear : true;
    const monthMatch = selectedMonth ? (`0${date.getMonth() + 1}`).slice(-2) === selectedMonth : true;
    return yearMatch && monthMatch;
  });
  setFilteredData(filtered);
}, [data, selectedYear, selectedMonth]);
const handleDownload = async () => {
  try {
    setDownloading(true);
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/loan-summary-pdf`,
      {
        params: { customerCode, customerName },
        responseType: 'blob',
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Loan_Summary_${customerCode}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (err) {
    toast.error("Failed to download report");
    console.error(err);
  } finally {
    setDownloading(false);
  }
};



  return (
    <>
     <>
    { downloading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative w-15 h-15">
        <div className="absolute inset-0 rounded-full border-[9px] border-t-transparent border-l-transparent border-r-blue-500 border-b-cyan-400 animate-spin" />
        <div className="absolute inset-[6px] bg-white rounded-full shadow-inner" />
      </div>
    </div>
        )}
    </>
      <ToastContainer />
      <SidePopup
        isOpen={isIncomePopupOpen}
        onClose={() => {
    setIsIncomePopupOpen(false);
    setIsEditMode(false);
    resetIncome();
  }}
        title={isEditMode ? 'Edit Income' : 'Add Income'}
      >
        <form onSubmit={handleSubmitIncome(onSubmitIncome)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Income Name <span className="text-red-500">*</span></label>
            <input {...registerIncome('name')} 
            type="text" 
            className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" 
            placeholder="Enter Income Name" />
            {IncomeErrors.IncomeName && <p className="text-red-500 text-xs">{IncomeErrors.IncomeName.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Amount <span className="text-red-500">*</span></label>
            <input 
            {...registerIncome('amount')} 
            type="number" 
            step="0.01"
            className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" 
            placeholder="Enter Amount" />
            {IncomeErrors.amount && <p className="text-red-500 text-xs">{IncomeErrors.amount.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
            <input 
            {...registerIncome('date')} type="date" className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            {IncomeErrors.date && <p className="text-red-500 text-xs">{IncomeErrors.date.message}</p>}
          </div>
          
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition text-sm">
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </SidePopup>
      <SidePopup
        isOpen={isPaymentPopupOpen}
        onClose={() => {
        setIsPaymentPopupOpen(false);
        resetPayment();
  }}
        title={selectedPaymentId ? 'Edit Payment' : 'Add Payment'}
      >
        <form onSubmit={handleSubmitPayment(onSubmitPayment)} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Amount <span className="text-red-500">*</span></label>
            <input {...registerPayment('PaymentAmount')} 
            type="number" 
            step="0.01"
            className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Enter Amount" />
            {paymentErrors.PaymentAmount && <p className="text-red-500 text-xs">{paymentErrors.PaymentAmount.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Date <span 
            className="text-red-500">*</span></label>
            <input {...registerPayment('paymentDate')} type="date" 
            className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            {paymentErrors.paymentDate && <p className="text-red-500 text-xs">{paymentErrors.paymentDate.message}</p>}
          </div>
          
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition text-sm">
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </SidePopup>
      <SidePopup
  isOpen={isDeletePopupOpen}
  onClose={() => {
    setIsDeletePopupOpen(false);
    setIncomeToDelete(null);
  }}
  title="Delete Income"
>
  <div className="flex flex-col items-center justify-center gap-6 p-6">
    <p className="text-gray-700 text-center text-lg">
      Are you sure you want to delete this Income?
    </p>
    <div className="flex justify-center gap-4">
      <button
        onClick={() => {
          setIsDeletePopupOpen(false);
          setIncomeToDelete(null);
        }}
        className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
      >
        Cancel
      </button>
      <button
        onClick={confirmDelete}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </div>
      </SidePopup>
      <SidePopup
  isOpen={isPaymentDeletePopupOpen}
  onClose={() => {
    setIsPaymentDeletePopupOpen(false);
    setPaymentToDelete(null);
  }}
  title="Delete Payment"
>
  <div className="flex flex-col items-center justify-center gap-6 p-6">
    <p className="text-gray-700 text-center text-lg">
      Are you sure you want to delete this payment?
    </p>
    <div className="flex justify-center gap-4">
      <button
        onClick={() => {
          setIsPaymentDeletePopupOpen(false);
          setPaymentToDelete(null);
        }}
        className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
      >
        Cancel
      </button>
      <button
        onClick={confirmDeletePayment}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </div>
      </SidePopup>

      <div className="flex min-h-screen bg-gray-100 text-gray-800">
        <AdminSidebar />
        <div className={`flex-1 transition-all duration-300 ${isHovered ? 'ml-64' : 'ml-20'}`}>
          <Navbar />
          <div className="p-6 mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Daily Budget</h2>
            </div>

<div className="mb-4 flex flex-wrap items-center gap-4 justify-between">
  <div className="flex gap-4 flex-wrap items-center">
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => handleSearch(e.target.value)}
      className="bg-white border border-gray-200 px-3 py-1 rounded-md w-40 focus:outline-none focus:ring-1 focus:ring-teal-400"
    />

    <select
      className="bg-white border border-gray-200 px-3 py-1 rounded-md w-30 focus:outline-none focus:ring-1 focus:ring-teal-400"
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
    >
      <option value="">All Years</option>
      {years.map((year) => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>

    <select
      className="bg-white border border-gray-200 px-3 py-1 rounded-md w-30 focus:outline-none focus:ring-1 focus:ring-teal-400"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    >
      <option value="">All Months</option>
      {months.map((month) => (
        <option key={month.value} value={month.value}>{month.label}</option>
      ))}
    </select>
  </div>

  <div className="flex items-center gap-3 ml-auto">
    
    <button
      onClick={handleDownload}
      
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
    >
      {downloading ? 'Downloading...' : 'Download PDF'}
    </button>
    <button
      onClick={() => setIsIncomePopupOpen(true)}
      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-teal-700 flex items-center gap-2 text-sm"
    >
      <Plus size={18} /> Add Income
    </button>
  </div>
</div>


            <DataTable
              columns={incomeColumns}
              data={filteredData}
              pagination
              highlightOnHover
              responsive
              customStyles={{
                headRow: { style: { minHeight: '40px' } },
                headCells: {
                  style: {
                    backgroundColor: '#CD5C5C',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '14px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    textTransform: 'uppercase'
                  },
                },
                rows: { style: { minHeight: '40px' } },
                cells: { style: { fontSize: '14px', paddingTop: '8px', paddingBottom: '8px' } },
              }}
            />

            <div className="text-right mt-2 text-lg font-semibold">
              Total Income Amount: Rs. {totalIncomeAmount.toLocaleString()}
            </div>

            <div className="mt-10">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">Expenses</h3>
                <button onClick={() => setIsPaymentPopupOpen(true)} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-teal-700 flex items-center gap-2 text-sm">
                <Plus size={18} /> Add Expenses
              </button> 
              </div>

              <DataTable
                columns={expenseColumns}
                data={paymentData}
                pagination
                highlightOnHover
                responsive
                customStyles={{
                  headRow: { style: { minHeight: '40px' } },
                  headCells: {
                    style: {
                      backgroundColor: '#6366f1',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '14px',
                      paddingTop: '8px',
                      paddingBottom: '8px',

                      textTransform: 'uppercase'
                    },
                  },
                  rows: { style: { minHeight: '40px' } },
                  cells: { style: { fontSize: '14px', paddingTop: '8px', paddingBottom: '8px' } },
                }}
              />

              <div className="text-right mt-2 text-lg font-semibold">
                Total Paid Amount: Rs. {totalPaidAmount.toLocaleString()}
              </div>
            </div>
          </div>
  <div className="flex justify-center mt-10 mb-10">
  <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md border border-gray-100 text-center">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Income Summary</h2>

    <div className="flex justify-between items-center mb-4 text-lg">
      <span className="font-medium text-gray-600">Total Income Amount</span>
      <span className="font-bold text-gray-900">
        Rs. {totalIncomeAmount.toLocaleString()}
      </span>
    </div>

    <div className="flex justify-between items-center mb-4 text-lg">
      <span className="font-medium text-gray-600">Total Paid</span>
      <span className="font-bold text-green-700">
        - Rs. {totalPaidAmount.toLocaleString()}
      </span>
    </div>

    <div className="border-t border-dashed my-4"></div>

    <div className="flex justify-between items-center text-xl font-semibold">
      <span className="text-gray-800">Remaining Balance</span>
      <span className="text-red-600">
        = Rs. {(totalIncomeAmount - totalPaidAmount).toLocaleString()}
      </span>
    </div>
  </div>
</div>

        </div>
      </div>
    </>
  );
};

export default Finance;
