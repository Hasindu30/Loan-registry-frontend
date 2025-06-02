import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/dashboard/AdminSidebar'
import Navbar from '../../components/dashboard/Navbar'
import DataTable from 'react-data-table-component'
import { useSidebar } from '../../context/SidebarContext' 
import { Plus, Pencil, Trash2 } from 'lucide-react';
import SidePopup from '../../components/dashboard/common/SidePopup'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
  const { isHovered } = useSidebar(); 
  const [data, setData] = useState([]);
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [customerCode, setCustomerCode] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null); 
  const navigate = useNavigate();
  useEffect(() => {
    fetchCustomers();
  }, []);
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/allcustomer',{
        params: { search },
      });
      setData(response.data);
      generateNextCustomerCode(response.data); 
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handleEdit = (row) => {
    setIsEditMode(true);                   
    setSelectedCustomerId(row._id);         
    setIsPopupOpen(true);                  
  
    // Prefill data
    setCustomerCode(row.empCode);
    setValue('empCode', row.empCode);
    setValue('firstName', row.firstName);
    setValue('lastName', row.lastName);
    setValue('initialsName', row.initialsName);
    setValue('contact', row.contact);
    setValue('address', row.address);
  };
  const validationSchema = yup.object().shape({
    empCode: yup.string().required('Customer Code is required'),
    firstName: yup.string(),
    lastName: yup.string(),
    initialsName: yup.string().required('Name with Initials is required'),
    contact: yup
      .number()
      .nullable()
      ,
    address: yup.string(), 
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });
  const columns = [
    {
      name: "Customer Code",
      selector: (row) => row.empCode,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) =>row.initialsName,
      sortable: true,
    },
    {
      name: "Contact",
      selector: (row) => row.contact,
    },
    {
      name: "Address",
      selector: (row) => row.address,
    },
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
  const generateNextCustomerCode = (customers) => {
    if (!customers || customers.length === 0) {
      setCustomerCode('EMP001');
      setValue('empCode', 'EMP001'); 
      return;
    }
  
    const lastCustomer = customers[0]; 
    const lastCode = lastCustomer.empCode || 'EMP000'; 
  
    const lastNumber = parseInt(lastCode.replace('EMP', ''), 10);
  
    if (isNaN(lastNumber)) {
      setCustomerCode('EMP001');
      setValue('empCode', 'EMP001');
      return;
    }
  
    const nextNumber = lastNumber + 1;
    const nextCode = `EMP${nextNumber.toString().padStart(3, '0')}`;
  
    setCustomerCode(nextCode);
    setValue('empCode', nextCode);
  };
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [deleteCustomerId, setDeleteCustomerId] = useState(null);
    const handleDelete = (id) => {
        setDeleteCustomerId(id);
        setIsDeletePopupOpen(true);
      };
      
      const confirmDelete = async () => {
        try {
          if (!deleteCustomerId) {
            console.error('No Customer selected for deletion.');
            return;
          }
      
          await axios.delete(`/api/customerDelete/${deleteCustomerId}`);
      
          toast.success('Customer deleted successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
      
          setIsDeletePopupOpen(false);
          setDeleteCustomerId(null); // clear selected id
          fetchCustomers();          // refresh Customer list
        } catch (error) {
          console.error(error);
          toast.error('Failed to delete Customer!', {
            position: "top-center",
            autoClose: false,
          });
        }
      };
      
      
      
  const onSubmit = async (data) => {
    const CustomerData = {
      empCode: customerCode,
      firstName: data.firstName,
      lastName: data.lastName,
      initialsName: data.initialsName,
      contact: data.contact,
      address: data.address,
    };
  
    try {
      if (isEditMode) {
       
        await axios.put(`/api/customerUpdate/${selectedCustomerId}`, CustomerData);
  
        toast.success('Customer updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await axios.post('/api/Customer', CustomerData);
  
        toast.success('Customer created successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
  
      setIsPopupOpen(false);
      setIsEditMode(false);
      fetchCustomers();  
      reset();           
      setCustomerCode('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create or update Customer!', {
        position: "top-center",
        autoClose: false,
      });
    }
  };
  

  return (
    <>
     <ToastContainer/>
     <SidePopup
  isOpen={isPopupOpen}
  onClose={() => {
    setIsPopupOpen(false);
    setIsEditMode(false);
    reset(); 
}
}
title={isEditMode ? "Edit Customer" : "Create Customer"} 
>
  
<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
  
  
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Customer Code <span className="text-red-500">*</span>
    </label>
    <input
    {...register('empCode')}
    type="text"
    defaultValue={customerCode}  
    onChange={(e) => {
      setCustomerCode(e.target.value); 
      setValue('empCode', e.target.value); 
    }}
    className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
    placeholder="Enter Customer Code"
  />
    {errors.empCode && <p className="text-red-500 text-xs">{errors.empCode.message}</p>}
  </div>

  
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      First Name 
    </label>
    <input
      {...register('firstName')}
      type="text"
      className="border rounded-md px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
      placeholder="Enter First Name"
    />
    
  </div>

 
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Last Name 
    </label>
    <input
      {...register('lastName')}
      type="text"
      className="border rounded-md px-3 py-2 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      placeholder="Enter Last Name"
    />
    
  </div>

 
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Name with Initials <span className="text-red-500">*</span>
    </label>
    <input
      {...register('initialsName')}
      type="text"
      className="border rounded-md border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      placeholder="Enter Name with Initials"
    />
    {errors.initialsName && <p className="text-red-500 text-xs">{errors.initialsName.message}</p>}
  </div>

  
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Contact Number 
    </label>
    <input
      {...register('contact')}
      type="number"
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      placeholder="Enter Contact Number"
    />
    
  </div>

 
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Address
    </label>
    <input
      {...register('address')}
      type="text"
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      placeholder="Enter Address"
    />
    
  </div>

  
  <div className="flex justify-end mt-6">
    <button
      type="submit"
      className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition text-sm"
    >
     {isEditMode ? "Update" : "Create"}
    </button>
  </div>

</form>

</SidePopup>
<SidePopup
 isOpen={isDeletePopupOpen}
 onClose={() => setIsDeletePopupOpen(false)}
 title="Delete Customer"
>
<div className="flex flex-col items-center justify-center gap-6 p-6">
    <p className="text-gray-700 text-center text-lg">
      Are you sure you want to delete this Customer?
    </p>
    <div className="flex justify-center gap-4">
      <button
        onClick={() => setIsDeletePopupOpen(false)}
        className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
      >
        No
      </button>
      <button
        onClick={confirmDelete}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Yes
      </button>
    </div>
  </div>
</SidePopup>

    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />
      
      
      <div className={`flex-1 transition-all duration-300 ${isHovered ? 'ml-64' : 'ml-20'}`}>
        <Navbar />

        <div className="p-6 mt-10">
          <h1 className="text-2xl font-semibold mb-3">Customer Registry</h1>
          <div className="mb-4 flex justify-between items-center gap-4">
          <input
              type="text"
              placeholder="Search"
              onChange={(e) =>{
                const value = e.target.value;
                setSearch(value);
                fetchCustomers(value);
              }}
              className="border border-gray-300 p-1 rounded-full w-50 focus:outline-none focus:ring-0 bg-white focus:ring-blue-200"
          />
          <button 
          onClick={() => setIsPopupOpen(true)}
          className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700 transition flex items-center gap-2">
            <Plus size={22} />
              Add
          </button>
         </div>
          
    <DataTable
    columns={columns}
    data={data}
     pagination
    highlightOnHover
    responsive
    selectableRows
    progressPending={loading}
    onRowClicked={(row) => navigate(`/loan-summary/${row._id}`, {
    state: {
      customerCode: row.empCode,
      customerName: row.initialsName
    }
  })}
    customStyles={{
    headRow: {
      style: {
        minHeight: '40px', 
        
      },
    },
    headCells: {
      style: {
        backgroundColor: '#808080',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '14px',
        paddingTop: '8px',
        paddingBottom: '8px',
        textTransform:"uppercase",
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
    </>
  );
}

export default Customer;
