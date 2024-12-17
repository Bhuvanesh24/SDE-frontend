import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddEmployee from './AddEmployee';  
import ViewEmployees from './ViewEmployees';  
import "./App.css";
const App = () => {
  return (
    <Router>
      <div className="App">
          <nav>
        <ul>
          <li>
            <a href="/">Add Employee</a>
          </li>
          <li>
            <a href="/view-employees">View Employees</a>
          </li>
        </ul>
      </nav>

        <Routes>
          <Route path="/" element={<AddEmployee />} />  {/* Route for Add Employee */}
          <Route path="/view-employees" element={<ViewEmployees />} />  {/* Route for View Employees */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
