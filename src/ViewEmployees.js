import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backend_url = "http://127.0.0.1:8000/";

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState({
    name: '',
    email: '',
    phone_number: '',
    department: '',
    date_of_joining: '',
    role: '',
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState(''); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${backend_url}api/employee/get-employees/`);
        setEmployees(response.data);
        setResponseMessage(''); 
      } catch (error) {
        console.error("Error fetching employees:", error);
        setResponseMessage("Failed to fetch employees. Please try again later.");
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (employeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      try {
        await axios.delete(`${backend_url}api/employee/delete-employee/${employeeId}/`);
        setEmployees(employees.filter((emp) => emp.employee_id !== employeeId));
        setResponseMessage("Employee deleted successfully.");
      } catch (error) {
        console.error("Error deleting employee:", error);
        setResponseMessage("Failed to delete employee. Please try again.");
      }
    }
  };

  const handleUpdate = (employeeId) => {
    const employeeToUpdate = employees.find(emp => emp.employee_id === employeeId);
    setUpdatedEmployeeData({
      name: employeeToUpdate.name,
      email: employeeToUpdate.email,
      phone_number: employeeToUpdate.phone_number,
      department: employeeToUpdate.department,
      date_of_joining: employeeToUpdate.date_of_joining,
      role: employeeToUpdate.role,
    });
    setSelectedEmployee(employeeId);
    setShowUpdateForm(true);
    setResponseMessage('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backend_url}api/employee/update-employee/${selectedEmployee}/`, updatedEmployeeData);
      setShowUpdateForm(false);
      const updatedEmployees = employees.map(emp => 
        emp.employee_id === selectedEmployee ? { ...emp, ...updatedEmployeeData } : emp
      );
      setEmployees(updatedEmployees);
      setResponseMessage("Employee updated successfully.");
    } catch (error) {
      console.error("Error updating employee:", error);
      setResponseMessage("Failed to update employee. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((emp) =>
    (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="container">
      <h1>Employee List</h1>
      {/* <input
        type="text"
        placeholder="Search employees"
        value={searchQuery}
        onChange={handleSearch}
      /> */}

      {/* Display Backend Response Message */}
      {responseMessage && (
        <div className="response-message">
          <p>{responseMessage}</p>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.employee_id}>
               <td>{emp.first_name.length > 10 ? emp.first_name.slice(0, 10) + '...' : emp.first_name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone_number}</td>
              <td>{emp.department}</td>
              <td>{emp.role}</td>
              <td>
                {/* <button onClick={() => handleUpdate(emp.employee_id)}>Update</button> */}
                <button onClick={() => handleDelete(emp.employee_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Overlay Update Form */}
      {showUpdateForm && (
        <div className="overlay">
          <div className="update-form">
            
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={updatedEmployeeData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={updatedEmployeeData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone_number">Phone Number:</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={updatedEmployeeData.phone_number}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department:</label>
                <select
                  id="department"
                  name="department"
                  value={updatedEmployeeData.department}
                  onChange={handleChange}
                >
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date_of_joining">Date of Joining:</label>
                <input
                  type="date"
                  id="date_of_joining"
                  name="date_of_joining"
                  value={updatedEmployeeData.date_of_joining}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role:</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={updatedEmployeeData.role}
                  onChange={handleChange}
                />
              </div>

              <button type="submit">Update Employee</button>
              <button type="button" onClick={() => setShowUpdateForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployees;
