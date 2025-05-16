import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import Navbar from '../../components/dashboard/Navbar';
import DataTable from 'react-data-table-component';
import { Plus } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import SidePopup from '../../components/dashboard/common/SidePopup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const LoanSummary = () => {
  const { isHovered } = useSidebar();
  const location = useLocation();
  const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
  const { customerCode, customerName } = location.state || {};
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
   const [selectedLoanId, setSelectedLoanId] = useState(null); 
const [isLoanPopupOpen, setIsLoanPopupOpen] = useState(false);
const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);

 

  

  useEffect(() => {
    fetchLoans();
    
  }, []);
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/allloans',{
      params: { customerCode } 
        
      });
      setData(response.data);
      
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
    const response = await axios.get('/api/allpayments', {
      params: { customerCode }
    });
    setPaymentData(response.data);
  } catch (err) {
    toast.error("Failed to load payments");
  }
};
  const handleEdit = (row) => {
      setIsEditMode(true);                   
      setSelectedLoanId(row._id);         
      setIsPopupOpen(true);                  
    
      // Prefill data
      
      setValue('loanName', row.loanName);
      setValue('date', row.date);
      setValue('amount', row.amount);
      setValue('remarks', row.remarks);
      
    };
  const loanSchema = yup.object().shape({
  loanName: yup.string().required('Loan name is required'),
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
  register: registerLoan,
  handleSubmit: handleSubmitLoan,
  reset: resetLoan,
  setValue: setLoanValue,
  formState: { errors: loanErrors }
} = useForm({ resolver: yupResolver(loanSchema) });

const {
  register: registerPayment,
  handleSubmit: handleSubmitPayment,
  reset: resetPayment,
  formState: { errors: paymentErrors }
} = useForm({ resolver: yupResolver(paymentSchema) });



useEffect(() => { fetchPayments(); }, [customerCode, isPaymentPopupOpen]);


const onSubmit = async (data) => {
  if (isPaymentPopupOpen) {
    try {
      await axios.post('/api/payments', {
        customerCode,
         date: data.paymentDate,     
          amount: data.PaymentAmount  
      });
      toast.success("Payment added");
      setIsPaymentPopupOpen(false);
      fetchPayments();
      resetPayment();
    } catch (err) {
      toast.error("Failed to add payment");
    }
    return;
  }
    const LoanData = {
      loanName:data.loanName,
      date:data.date,
      amount:data.amount,
      remarks:data.remarks,
      customerCode: customerCode,
    };
  try {
      if (isEditMode) {
       
        await axios.put(`/api/loanUpdate/${selectedLoanId}`, LoanData);
  
        toast.success('Loan updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await axios.post('/api/loans', LoanData);
  
        toast.success('loan created successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
  
      setIsLoanPopupOpen(false);
      setIsEditMode(false);
      fetchLoans();  
      resetLoan();           
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to create or update Loans!', {
        position: "top-center",
        autoClose: false,
      });
    }
  };
 const onSubmitLoan = (data) => onSubmit(data);
const onSubmitPayment = (data) => onSubmit(data);
  // const onSubmit = async (data) => {
  //   try {
  //     await axios.post(`${import.meta.env.VITE_API_BASE_URL}/loans`, data);
  //     toast.success('Loan created successfully!');
  //     setIsPopupOpen(false);
  //     reset();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Failed to create loan');
  //   }
  // };

  const loanColumns = [
    { name: 'Loan Name', selector: (row) => row.loanName, sortable: true },
    { name: 'Date', selector: (row) => new Date(row.date).toLocaleDateString(), sortable: true },
    { name: 'Amount', selector: (row) => `Rs. ${row.amount.toLocaleString()}`, sortable: true },
    { name: 'Remarks', selector: (row) => row.remarks || '-', sortable: true },
    //  {
    //   name: "Action",
    //   cell: (row) => (
    //     <div className="flex gap-3">
    //       <button
    //         onClick={() => handleEdit(row)}
    //         className="text-blue-500 hover:text-blue-700"
    //       >
    //         <Pencil size={18} />
    //       </button>
    //       <button
    //         onClick={() => handleDelete(row._id)}
    //         className="text-red-500 hover:text-red-700"
    //       >
    //         <Trash2 size={18} />
    //       </button>
    //     </div>
    //   ),
    //   ignoreRowClick: true,   
    // }
  ];

  const paymentColumns = [
    { name: 'Payment Date', selector: (row) => new Date(row.date).toLocaleDateString('en-CA'), sortable: true },
    { name: 'Amount', selector: (row) => `Rs. ${row.amount.toLocaleString()}`, sortable: true },
  ];

 const totalLoanAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalPaidAmount = paymentData.reduce((sum, item) => sum + item.amount, 0);
  const remainingAmount = totalLoanAmount - totalPaidAmount;

  return (
    <>
      <ToastContainer />
      <SidePopup
        isOpen={isLoanPopupOpen}
        onClose={() => {
    setIsLoanPopupOpen(false);
    setIsEditMode(false);
    resetLoan();
  }}
        title={isEditMode ? 'Edit Loan' : 'Add Loan'}
      >
        <form onSubmit={handleSubmitLoan(onSubmitLoan)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Loan Name <span className="text-red-500">*</span></label>
            <input {...registerLoan('loanName')} type="text" className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Enter Loan Name" />
            {loanErrors.loanName && <p className="text-red-500 text-xs">{loanErrors.loanName.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Amount <span className="text-red-500">*</span></label>
            <input {...registerLoan('amount')} type="number" className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Enter Amount" />
            {loanErrors.amount && <p className="text-red-500 text-xs">{loanErrors.amount.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
            <input {...registerLoan('date')} type="date" className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" />
            {loanErrors.date && <p className="text-red-500 text-xs">{loanErrors.date.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Remarks</label>
            <textarea {...registerLoan('remarks')} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Optional remarks"></textarea>
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
        title={isEditMode ? 'Edit Payment' : 'Add Payment'}
      >
        <form onSubmit={handleSubmitPayment(onSubmitPayment)} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Amount <span className="text-red-500">*</span></label>
            <input {...registerPayment('PaymentAmount')} 
            type="number" 
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

      <div className="flex min-h-screen bg-gray-100 text-gray-800">
        <AdminSidebar />
        <div className={`flex-1 transition-all duration-300 ${isHovered ? 'ml-64' : 'ml-20'}`}>
          <Navbar />
          <div className="p-6 mt-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Loan Summary - {customerName} ({customerCode})</h2>
            </div>

            <div className="mb-4 flex justify-between items-center gap-4">
              <input
                type="text"
                placeholder="Search loan type..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
             <button onClick={() => setIsLoanPopupOpen(true)} className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 flex items-center gap-2 text-sm">
                <Plus size={18} /> Add Loan
              </button> 
            </div>

            <DataTable
              columns={loanColumns}
              data={data}
              pagination
              highlightOnHover
              responsive
              customStyles={{
                headRow: { style: { minHeight: '40px' } },
                headCells: {
                  style: {
                    backgroundColor: '#0fcea0',
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
              Total Loan Amount: Rs. {totalLoanAmount.toLocaleString()}
            </div>

            <div className="mt-10">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">Loan Payment History</h3>
                <button onClick={() => setIsPaymentPopupOpen(true)} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-teal-700 flex items-center gap-2 text-sm">
                <Plus size={18} /> Add Payment
              </button> 
              </div>

              <DataTable
                columns={paymentColumns}
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
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Summary</h2>

    <div className="flex justify-between items-center mb-4 text-lg">
      <span className="font-medium text-gray-600">Total Loan Amount</span>
      <span className="font-bold text-gray-900">
        Rs. {totalLoanAmount.toLocaleString()}
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
        = Rs. {(totalLoanAmount - totalPaidAmount).toLocaleString()}
      </span>
    </div>
  </div>
</div>

        </div>
      </div>
    </>
  );
};

export default LoanSummary;
