import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Outlet, Route, Routes} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import Sidebar from './components/home/sidebar/SideBar';

function App() {
  return (
    <div className="App">
      <Outlet></Outlet>  
    </div>
  );
}

export default App;
