import React, { useState } from 'react';
import axios from 'axios';
import './AddEmployee.css';

const backend_url = "https://sde-backend-production.up.railway.app/";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    department: '',
    date_of_joining: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zAOH]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));

        
        if (value.length === 10) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            phone_number: '',
          }));
        }
      } else {
      
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone_number: "Only numbers are allowed, and the length must be 10 digits.",
        }));
      }
    } else {
     
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '', 
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      department: '',
      date_of_joining: '',
      role: '',
    });
    setErrors({});
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backend_url}api/employee/add-employee/`, formData);

      
      if (response.status === 201) {
        setSuccessMessage("Employee added successfully!");

        
        setTimeout(() => {
          handleReset(); 
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
       
        setErrors(error.response.data || { message: "An error occurred" });
      } else {
      
        setErrors({ message: "An unexpected error occurred. Please try again later." });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.employee_id) formErrors.employee_id = "Employee ID is required.";
    if (!formData.first_name) formErrors.first_name = "First Name is required.";
    if (!formData.last_name) formErrors.last_name = "Last Name is required.";
    if (!formData.email) formErrors.email = "Email is required.";
    if (!formData.phone_number) formErrors.phone_number = "Phone number is required.";
    if (!formData.department) formErrors.department = "Department is required.";
    if (!formData.date_of_joining) formErrors.date_of_joining = "Date of joining is required.";
    if (!formData.role) formErrors.role = "Role is required.";

    if (formData.phone_number && formData.phone_number.length !== 10) {
      formErrors.phone_number = "Phone number must contain exactly 10 digits.";
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      formErrors.email = "Please enter a valid email address.";
    }

    if (formData.date_of_joining && new Date(formData.date_of_joining) > new Date()) {
      formErrors.date_of_joining = "Date of joining cannot be in the future.";
    }

    return formErrors;
  };

  const errorsExist = Object.keys(errors).length > 0;

  return (
    <div className="container">
      <h1>Add Employee</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.message && <p className="error">{errors.message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Employee ID */}
        <div className="form-group">
          <label htmlFor="employee_id">Employee ID:</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
          />
          {errors.employee_id && <p className="error">{errors.employee_id}</p>}
        </div>

        {/* First Name */}
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p className="error">{errors.first_name}</p>}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p className="error">{errors.last_name}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="phone_number">Phone Number:</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
          {errors.phone_number && <p className="error">{errors.phone_number}</p>}
        </div>

        {/* Department */}
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="HR">Human Resources</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
          {errors.department && <p className="error">{errors.department}</p>}
        </div>

        {/* Date of Joining */}
        <div className="form-group">
          <label htmlFor="date_of_joining">Date of Joining:</label>
          <input
            type="date"
            id="date_of_joining"
            name="date_of_joining"
            value={formData.date_of_joining}
            max={new Date().toISOString().split("T")[0]} 
            onChange={handleChange}
          />
          {errors.date_of_joining && <p className="error">{errors.date_of_joining}</p>}
        </div>

        {/* Role */}
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          {errors.role && <p className="error">{errors.role}</p>}
        </div>

        {/* Submit and Reset Buttons */}
        <button
          type="submit"
          disabled={loading || Object.values(errors).some(err => err !== '')}
        >
          {loading ? 'Submitting...' : 'Add Employee'}
        </button>

        <button type="button" onClick={handleReset} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
