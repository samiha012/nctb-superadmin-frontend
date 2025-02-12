import React, { useEffect, useState } from 'react';
import '../App.css';
import Logo from '../images/logo.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Cookie from 'universal-cookie';
const API_URL = process.env.REACT_APP_API_URL
const cookie = new Cookie();

const Navbar = () => {
  const handleLogout = () => {
    // cookie.remove('token');
    localStorage.removeItem('email');
    window.location.href = '/';
    toast.success("Logged out successfully!");
  }
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const email = localStorage.getItem('email');
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={Logo} className="h-8" alt="ACS Logo" />
          <span className="self-center text-xl md:text-2xl font-semibold whitespace-nowrap dark:text-white">জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (এনসিটিবি)</span>
        </a>
        <button data-collapse-toggle="navbar-default" onClick={toggleMenu} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`w-full md:block md:w-auto ${isMenuOpen ? "block" : "hidden"}`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <button disabled onClick={handleLogout} className="w-full text-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">{email}</button>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Sign Out</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

const Dashboard = () => {
  const [managers, setManagers] = React.useState([])
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [examModalOpen, setExamModalOpen] = React.useState(false);
  const [managerEmail, setManagerEmail] = React.useState(false);
  const [exams, setExams] = React.useState([]);
  const [examTable, setExamTable] = React.useState(false);
  const [examDeleteModalOpen, setExamDeleteModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [updatedData, setUpdatedData] = React.useState({})
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [branch, setBranch] = React.useState({});
  const [branchData, setBranchData] = useState([])

  const [examName, setExamName] = useState('');
  const [date, setDate] = useState('');
  const [batchName, setBatchName] = useState('');

  const batches = ["Engineering", "Varsity", "Medical"]

  const openModal = () => {
    setModalOpen(true);
  };

  const createSheet = () => {
    if (examName !== '' && date !== '') {
      const id = toast.loading("creating attendence sheet...")
      const fetchData = async () => {
        try {
          const response = await fetch(`${API_URL}/create-sheet`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              exam: examName,
              date: date,
              batch: batchName,
            })
          });
          const jsonData = await response.json();
          setExamModalOpen(false);
           axios.get(`${API_URL}/sheet`)
          .then(response => {
            setExams(response.data)
          })
          .catch(error => {
            console.error(error)
          })
          toast.update(id, { render: `${jsonData.message}`, type: "success", isLoading: false, autoClose: 2000 });
        } catch (error) {
          toast.update(id, { type: "error", autoClose: 3000, render: "Couldn't create sheet", isLoading: false })
        }
      };
      fetchData()
    }
    else {
      toast.error("Please enter all correct information!")
    }
  }

  const handleExamDelete = () => {
    axios.post(`${API_URL}/sheet/delete`, { exam: examName, date: date })
      .then(response => {
        toast.success("Exam record deleted successfully!")
        setExamDeleteModalOpen(false);
        axios.get(`${API_URL}/sheet`)
          .then(response => {
            setExams(response.data)
          })
          .catch(error => {
            console.error(error)
          })
      })
      .catch(error => {
        toast.error("Error deleting exam record!")
      });
  }

  const handleEdit = () => {
    axios.post(`${API_URL}/sheet/update`, { exam: examName, batch: batchName, date: date, updatedData })
      .then(response => {
        toast.success("Exam updated successfully!")
        setEditModalOpen(false);
        axios.get(`${API_URL}/sheet`)
          .then(response => {
            setExams(response.data)
          })
          .catch(error => {
            console.error(error)
          })
      })
      .catch(error => {
        toast.error("Error updating exam!")
      });
  }

  function getRelativeTime(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    console.log(seconds)

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60 && minutes > 1) {
      return minutes + ' minutes' + ' ago';
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24 && hours > 1) {
      return hours + ' hours' + ' ago';
    }

    const days = Math.floor(hours / 24);
    if (days > 1) {
      return days + ' ' + 'days' + ' ago';
    }
    else {
      return seconds + ' ' + 'secs' + ' ago';
    }
  }

  const handleCheck = (e) => {
    const checked = e.target.checked;
    setExamTable(checked)
  }

  const handleDelete = () => {
    axios.post(`${API_URL}/manager/delete`, { email: managerEmail })
      .then(response => {
        setManagerEmail("")
        if (response.data.success == true) {
          toast.success("Manager deleted successfully!");
          setDeleteModalOpen(false);
          axios.get(`${API_URL}/managers`)
            .then(response => {
              setManagers(response.data)
            })
            .catch(error => {
              console.error(error)
            })
        }
        else {
          toast.error(response.data);
        }
      })
      .catch(error => {
        toast.error(error.message)
        console.error(error)
      })
  }

  const handleSubmit = () => {
    if (!email || !pass ) {
      return toast.error("Please fill in all the fields!")
    }

    axios.post(`${API_URL}/user/create`, { email, pass }, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
      if (response.data.success === true) {
        toast.success("User created successfully!");
        setModalOpen(false);
        setEmail('');
        setPass('');
        setBranch('');
        axios.get(`${API_URL}/users`)
          .then(response => {
            setManagers(response.data)
          })
          .catch(error => {
            console.error(error)
          })
      }
      else {
        toast.error(response.data);
      }
    })
      .catch(response => toast.error('User already exists for this email'))
  }

  const closeModal = () => {
    setModalOpen(false);
  };

  React.useEffect(() => {
    axios.get(`${API_URL}/users`)
      .then(response => {
        setManagers(response.data)
      })
      .catch(error => {
        console.error(error)
      })

    axios.get(`${API_URL}/sheet`)
      .then(response => {
        setExams(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button data-modal-target="crud-modal" onClick={openModal} data-modal-toggle="crud-modal" className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800" type="button">
                  <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Add user
                </button>
                <button data-modal-target="crud-modal" onClick={() => setExamModalOpen(true)} data-modal-toggle="crud-modal" className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800" type="button">
                  <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Add Exam
                </button>
              </div>
              <div className="flex flex-row-reverse items-center space-x-3 w-full md:w-auto">
                <label class="inline-flex items-center mb-5 cursor-pointer">
                  <span className="ms-3 text-sm select-none font-medium text-gray-900 dark:text-gray-300 pr-1">Users</span>
                  <input type="checkbox" onChange={handleCheck} value="" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300  rounded-full peer dark:bg-green-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-green-600"></div>
                  <span className="ms-3 text-sm font-medium select-none text-gray-900 dark:text-gray-300">Exams</span>
                </label>
              </div>
            </div>

            <div className="overflow-x-auto">
              {!examTable ? (
                <table className="w-full text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3">Email</th>
                      <th scope="col" className="px-4 py-3">Created At</th>
                      <th scope="col" className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers.map((item, index) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3">{getRelativeTime(new Date(item.createdAt).getTime())}</td>
                        <td className="px-4 py-3"><button onClick={e => {
                          setDeleteModalOpen(true)
                          setManagerEmail(item.email)
                        }} className='flex items-center justify-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 64 64"
                          fill="#FFFFFF">
                            <path d="M 26.9375 4 C 26.0435 4 25.203813 4.3940781 24.632812 5.0800781 C 24.574813 5.1490781 24.527234 5.2256406 24.490234 5.3066406 L 22.357422 10 L 11 10 C 9.346 10 8 11.346 8 13 L 8 19 C 8 20.654 9.346 22 11 22 L 13 22 L 13 57 C 13 58.654 14.346 60 16 60 L 48 60 C 49.654 60 51 58.654 51 57 L 51 22 L 53 22 C 54.654 22 56 20.654 56 19 L 56 13 C 56 11.346 54.654 10 53 10 L 41.644531 10 L 39.511719 5.3066406 C 39.474719 5.2256406 39.426141 5.1480781 39.369141 5.0800781 C 38.797141 4.3940781 37.957453 4 37.064453 4 L 26.9375 4 z M 26.9375 6 L 37.0625 6 C 37.3225 6 37.569906 6.1003437 37.753906 6.2773438 L 39.447266 10 L 24.552734 10 L 26.246094 6.2773438 C 26.431094 6.1003438 26.6775 6 26.9375 6 z M 11 12 L 53 12 C 53.551 12 54 12.448 54 13 L 54 19 C 54 19.552 53.551 20 53 20 L 11 20 C 10.449 20 10 19.552 10 19 L 10 13 C 10 12.448 10.449 12 11 12 z M 14 14 C 13.448 14 13 14.447 13 15 L 13 17 C 13 17.553 13.448 18 14 18 C 14.552 18 15 17.553 15 17 L 15 15 C 15 14.447 14.552 14 14 14 z M 19 14 C 18.448 14 18 14.447 18 15 L 18 17 C 18 17.553 18.448 18 19 18 C 19.552 18 20 17.553 20 17 L 20 15 C 20 14.447 19.552 14 19 14 z M 24 14 C 23.448 14 23 14.447 23 15 L 23 17 C 23 17.553 23.448 18 24 18 C 24.552 18 25 17.553 25 17 L 25 15 C 25 14.447 24.552 14 24 14 z M 29 14 C 28.448 14 28 14.447 28 15 L 28 17 C 28 17.553 28.448 18 29 18 C 29.552 18 30 17.553 30 17 L 30 15 C 30 14.447 29.552 14 29 14 z M 35 14 C 34.448 14 34 14.447 34 15 L 34 17 C 34 17.553 34.448 18 35 18 C 35.552 18 36 17.553 36 17 L 36 15 C 36 14.447 35.552 14 35 14 z M 40 14 C 39.448 14 39 14.447 39 15 L 39 17 C 39 17.553 39.448 18 40 18 C 40.552 18 41 17.553 41 17 L 41 15 C 41 14.447 40.552 14 40 14 z M 45 14 C 44.448 14 44 14.447 44 15 L 44 17 C 44 17.553 44.448 18 45 18 C 45.552 18 46 17.553 46 17 L 46 15 C 46 14.447 45.552 14 45 14 z M 50 14 C 49.448 14 49 14.447 49 15 L 49 17 C 49 17.553 49.448 18 50 18 C 50.552 18 51 17.553 51 17 L 51 15 C 51 14.447 50.552 14 50 14 z M 15 22 L 49 22 L 49 57 C 49 57.552 48.551 58 48 58 L 16 58 C 15.449 58 15 57.552 15 57 L 15 56 L 38 56 C 38.552 56 39 55.553 39 55 C 39 54.447 38.552 54 38 54 L 15 54 L 15 22 z M 20 28 C 19.448 28 19 28.447 19 29 L 19 41 C 19 41.553 19.448 42 20 42 C 20.552 42 21 41.553 21 41 L 21 29 C 21 28.447 20.552 28 20 28 z M 28 28 C 27.448 28 27 28.447 27 29 L 27 49 C 27 49.553 27.448 50 28 50 C 28.552 50 29 49.553 29 49 L 29 29 C 29 28.447 28.552 28 28 28 z M 36 28 C 35.448 28 35 28.447 35 29 L 35 49 C 35 49.553 35.448 50 36 50 C 36.552 50 37 49.553 37 49 L 37 29 C 37 28.447 36.552 28 36 28 z M 44 28 C 43.448 28 43 28.447 43 29 L 43 33 C 43 33.553 43.448 34 44 34 C 44.552 34 45 33.553 45 33 L 45 29 C 45 28.447 44.552 28 44 28 z M 44 36 C 43.448 36 43 36.447 43 37 L 43 49 C 43 49.553 43.448 50 44 50 C 44.552 50 45 49.553 45 49 L 45 37 C 45 36.447 44.552 36 44 36 z M 20 44 C 19.448 44 19 44.447 19 45 L 19 49 C 19 49.553 19.448 50 20 50 C 20.552 50 21 49.553 21 49 L 21 45 C 21 44.447 20.552 44 20 44 z M 42 54 C 41.448 54 41 54.447 41 55 C 41 55.553 41.448 56 42 56 L 46 56 C 46.552 56 47 55.553 47 55 C 47 54.447 46.552 54 46 54 L 42 54 z"></path>
                          </svg></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3">Exam</th>
                      <th scope="col" className="px-4 py-3">Batch</th>
                      <th scope="col" className="px-4 py-3">Date</th>
                      <th scope="col" className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((item, index) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-4 py-3">{item.exam}</td>
                        <td className="px-4 py-3">{item.batch}</td>
                        <td className="px-4 py-3">{item.date}</td>
                        <td className="px-4 py-3 flex items-center space-x-2"><button onClick={e => {
                          setExamDeleteModalOpen(true);
                          setExamName(item.exam);
                          setDate(item.date);
                        }} className='flex items-center justify-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 64 64"
                          fill="#FFFFFF">
                            <path d="M 26.9375 4 C 26.0435 4 25.203813 4.3940781 24.632812 5.0800781 C 24.574813 5.1490781 24.527234 5.2256406 24.490234 5.3066406 L 22.357422 10 L 11 10 C 9.346 10 8 11.346 8 13 L 8 19 C 8 20.654 9.346 22 11 22 L 13 22 L 13 57 C 13 58.654 14.346 60 16 60 L 48 60 C 49.654 60 51 58.654 51 57 L 51 22 L 53 22 C 54.654 22 56 20.654 56 19 L 56 13 C 56 11.346 54.654 10 53 10 L 41.644531 10 L 39.511719 5.3066406 C 39.474719 5.2256406 39.426141 5.1480781 39.369141 5.0800781 C 38.797141 4.3940781 37.957453 4 37.064453 4 L 26.9375 4 z M 26.9375 6 L 37.0625 6 C 37.3225 6 37.569906 6.1003437 37.753906 6.2773438 L 39.447266 10 L 24.552734 10 L 26.246094 6.2773438 C 26.431094 6.1003438 26.6775 6 26.9375 6 z M 11 12 L 53 12 C 53.551 12 54 12.448 54 13 L 54 19 C 54 19.552 53.551 20 53 20 L 11 20 C 10.449 20 10 19.552 10 19 L 10 13 C 10 12.448 10.449 12 11 12 z M 14 14 C 13.448 14 13 14.447 13 15 L 13 17 C 13 17.553 13.448 18 14 18 C 14.552 18 15 17.553 15 17 L 15 15 C 15 14.447 14.552 14 14 14 z M 19 14 C 18.448 14 18 14.447 18 15 L 18 17 C 18 17.553 18.448 18 19 18 C 19.552 18 20 17.553 20 17 L 20 15 C 20 14.447 19.552 14 19 14 z M 24 14 C 23.448 14 23 14.447 23 15 L 23 17 C 23 17.553 23.448 18 24 18 C 24.552 18 25 17.553 25 17 L 25 15 C 25 14.447 24.552 14 24 14 z M 29 14 C 28.448 14 28 14.447 28 15 L 28 17 C 28 17.553 28.448 18 29 18 C 29.552 18 30 17.553 30 17 L 30 15 C 30 14.447 29.552 14 29 14 z M 35 14 C 34.448 14 34 14.447 34 15 L 34 17 C 34 17.553 34.448 18 35 18 C 35.552 18 36 17.553 36 17 L 36 15 C 36 14.447 35.552 14 35 14 z M 40 14 C 39.448 14 39 14.447 39 15 L 39 17 C 39 17.553 39.448 18 40 18 C 40.552 18 41 17.553 41 17 L 41 15 C 41 14.447 40.552 14 40 14 z M 45 14 C 44.448 14 44 14.447 44 15 L 44 17 C 44 17.553 44.448 18 45 18 C 45.552 18 46 17.553 46 17 L 46 15 C 46 14.447 45.552 14 45 14 z M 50 14 C 49.448 14 49 14.447 49 15 L 49 17 C 49 17.553 49.448 18 50 18 C 50.552 18 51 17.553 51 17 L 51 15 C 51 14.447 50.552 14 50 14 z M 15 22 L 49 22 L 49 57 C 49 57.552 48.551 58 48 58 L 16 58 C 15.449 58 15 57.552 15 57 L 15 56 L 38 56 C 38.552 56 39 55.553 39 55 C 39 54.447 38.552 54 38 54 L 15 54 L 15 22 z M 20 28 C 19.448 28 19 28.447 19 29 L 19 41 C 19 41.553 19.448 42 20 42 C 20.552 42 21 41.553 21 41 L 21 29 C 21 28.447 20.552 28 20 28 z M 28 28 C 27.448 28 27 28.447 27 29 L 27 49 C 27 49.553 27.448 50 28 50 C 28.552 50 29 49.553 29 49 L 29 29 C 29 28.447 28.552 28 28 28 z M 36 28 C 35.448 28 35 28.447 35 29 L 35 49 C 35 49.553 35.448 50 36 50 C 36.552 50 37 49.553 37 49 L 37 29 C 37 28.447 36.552 28 36 28 z M 44 28 C 43.448 28 43 28.447 43 29 L 43 33 C 43 33.553 43.448 34 44 34 C 44.552 34 45 33.553 45 33 L 45 29 C 45 28.447 44.552 28 44 28 z M 44 36 C 43.448 36 43 36.447 43 37 L 43 49 C 43 49.553 43.448 50 44 50 C 44.552 50 45 49.553 45 49 L 45 37 C 45 36.447 44.552 36 44 36 z M 20 44 C 19.448 44 19 44.447 19 45 L 19 49 C 19 49.553 19.448 50 20 50 C 20.552 50 21 49.553 21 49 L 21 45 C 21 44.447 20.552 44 20 44 z M 42 54 C 41.448 54 41 54.447 41 55 C 41 55.553 41.448 56 42 56 L 46 56 C 46.552 56 47 55.553 47 55 C 47 54.447 46.552 54 46 54 L 42 54 z"></path>
                          </svg></button>
                          <button onClick={e => {
                            setEditModalOpen(true);
                            setExamName(item.exam);
                            setDate(item.date);
                            setBatchName(item.batch)
                            setUpdatedData({ date: item.date, batch: item.batch })
                          }}
                            className='flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,300,300"
                              fill="#FFFFFF">
                              <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style={{ "mix-blend-mode": "normal" }}><g transform="scale(4,4)"><path d="M48.09766,3.45313c-1.03516,0 -2.07031,0.375 -2.82812,1.13281l-4.23828,4.24219c-0.78125,-0.78125 -2.05078,-0.78125 -2.82812,0l-5.65625,5.65625c-0.37891,0.37891 -0.58984,0.88281 -0.58984,1.41797c0,0.53125 0.21094,1.03516 0.58984,1.41016l0.04688,0.05078l-27.07812,27.03516c-0.50391,0.50391 -0.80859,1.17188 -0.86719,1.88281l-0.67578,8.39453l-0.70312,4.92188c-0.04687,0.3125 0.05859,0.625 0.28516,0.85156c0.1875,0.1875 0.44141,0.28906 0.70312,0.28906c0.05078,0 0.09766,0 0.14453,-0.00781l4.91797,-0.69922l8.44531,-0.625c0.71875,-0.05078 1.39063,-0.35937 1.89844,-0.86719l27.07813,-27.03906c0.37109,0.34766 0.84766,0.54297 1.35938,0.54297c0.53516,0 1.03516,-0.20703 1.41406,-0.58594l5.65625,-5.65625c0.78125,-0.78125 0.78125,-2.04687 0,-2.82812l4.24609,-4.24219c0.75391,-0.75781 1.16797,-1.76172 1.16797,-2.83203c0,-1.06641 -0.41406,-2.07422 -1.17187,-2.82812l-8.48437,-8.48437c-0.75391,-0.75781 -1.79297,-1.13281 -2.83203,-1.13281zM48.09766,5.43359c0.51953,0 1.03906,0.1875 1.41797,0.56641l8.48438,8.48438c0.37891,0.37891 0.58594,0.87891 0.58594,1.41406c0,0.53516 -0.20703,1.03906 -0.58594,1.41406l-4.24219,4.24609l-11.31641,-11.31641l4.24609,-4.24219c0.375,-0.37891 0.89453,-0.56641 1.41016,-0.56641zM39.61328,10.24219l0.71094,0.70703l12.72656,12.72656l0.70703,0.71094l-1.41406,1.41016c-0.39062,-0.39062 -1.02344,-0.39062 -1.41406,0l-1.41406,1.41797c-0.39062,0.39063 -0.39062,1.02344 0,1.41406l-1.41406,1.41406l-14.14453,-14.14453l1.41406,-1.41406c0.19531,0.19531 0.44922,0.29297 0.70703,0.29297c0.25781,0 0.51172,-0.09766 0.70703,-0.29297l1.41797,-1.41406c0.39063,-0.39062 0.39063,-1.02344 0,-1.41406zM41.03125,14.89844c-0.25781,0 -0.51172,0.09766 -0.70703,0.29297l-1.41797,1.41406c-0.39062,0.39063 -0.39062,1.02344 0,1.41406c0.19531,0.19531 0.45313,0.29297 0.70703,0.29297c0.25781,0 0.51563,-0.09766 0.71094,-0.29297l1.41016,-1.41406c0.39453,-0.39062 0.39453,-1.02344 0,-1.41406c-0.19531,-0.19531 -0.44922,-0.29297 -0.70312,-0.29297zM44.5625,18.4375c-0.25391,0 -0.50781,0.09375 -0.70312,0.29297l-1.41797,1.41016c-0.39062,0.39453 -0.39062,1.02344 0,1.41797c0.19531,0.19141 0.45313,0.28906 0.71094,0.28906c0.25391,0 0.51172,-0.09766 0.70703,-0.28906l1.41016,-1.41797c0.39453,-0.39062 0.39453,-1.01953 0,-1.41016c-0.19531,-0.19922 -0.44922,-0.29297 -0.70703,-0.29297zM34.01172,18.77734l11.3125,11.31641l-26.29687,26.25391l-0.95312,-4.76562l16.58984,-16.58984c0.39063,-0.39062 0.39063,-1.02344 0,-1.41406c-0.39062,-0.39062 -1.01953,-0.39062 -1.41406,0l-16.59375,16.59375l-2.35547,-0.47266l-0.47266,-2.35937l13.76563,-13.76172c0.39453,-0.39453 0.39453,-1.02344 0,-1.41797c-0.39062,-0.39062 -1.01953,-0.39062 -1.41016,0l-13.76562,13.76563l-4.66406,-0.92969zM48.10156,21.96875c-0.25781,0 -0.51172,0.09766 -0.70703,0.29688l-1.41406,1.41016c-0.39062,0.39453 -0.39062,1.02344 0,1.41797c0.19531,0.19141 0.44922,0.29297 0.70703,0.29297c0.25781,0 0.51172,-0.10156 0.70703,-0.29297l1.41406,-1.41797c0.39063,-0.39062 0.39063,-1.01953 0,-1.41016c-0.19531,-0.19922 -0.44922,-0.29687 -0.70703,-0.29687zM32.54688,26.21484c-0.25781,0 -0.51172,0.09766 -0.70703,0.28906l-2.82812,2.82813c-0.39453,0.39453 -0.39453,1.02344 0,1.41797c0.19141,0.19141 0.44922,0.29297 0.70703,0.29297c0.25391,0 0.51172,-0.10156 0.70313,-0.29297l2.82813,-2.82812c0.39453,-0.39453 0.39453,-1.02344 0,-1.41797c-0.19531,-0.19531 -0.44922,-0.29297 -0.70312,-0.28906zM6.60938,46.80469l5.28516,1.05469l0.57422,2.88672c0.08203,0.39453 0.39063,0.70313 0.78516,0.78125l2.88281,0.57813l1.06641,5.33594l-7.60937,0.55859l-3.59375,-3.58984z"></path></g></g>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Add User Modal */}
      
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${modalOpen ? '' : 'hidden'}`}>
        <div className="flex relative m-auto justify-center self-center p-4 w-full max-w-md max-h-full">

          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New User
              </h3>
              <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Email Address" required />
                </div>
                <div className="col-span-2">
                  <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="text" value={pass} onChange={e => setPass(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Password" required />
                </div>
              </div>
              <button type="submit" onClick={handleSubmit} className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                Add new user
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Exam Modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${examModalOpen ? '' : 'hidden'}`}>
        <div className="flex relative m-auto justify-center self-center p-4 w-full max-w-md max-h-full">

          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Exam
              </h3>
              <button type="button" onClick={() => setExamModalOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exam Title</label>
                  <input value={examName} onChange={e => setExamName(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Exam name" required />
                </div>
                <div className="col-span-2">
                  <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Date in DD-MM-YY format:</label>
                  <input type="text" value={date} onChange={e => setDate(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="DD-MM-YY" required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label for="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter batch:</label>

                  <select
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  >
                    <option value="">Select a Batch</option>
                    {batches.map((batch, index) => (
                      <option key={index} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" onClick={createSheet} className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Manager Modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${deleteModalOpen ? '' : 'hidden'}`}>
        <div className="flex relative m-auto justify-center self-center p-4 w-full max-w-md max-h-full">

          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Manager
              </h3>
              <button type="button" onClick={e => setDeleteModalOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <h6 className='pb-1'>Are you sure you want to delete manager <b>{managerEmail}?</b></h6>
              <button type="submit" onClick={handleDelete} className="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">

                Delete manager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Exam Modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${examDeleteModalOpen ? '' : 'hidden'}`}>
        <div className="flex relative m-auto justify-center self-center p-4 w-full max-w-md max-h-full">

          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Exam
              </h3>
              <button type="button" onClick={e => setExamDeleteModalOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="exam-delete-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <h6 className='pb-1'>Are you sure you want to delete exam <b>{examName}?</b></h6>
              <button type="submit" onClick={handleExamDelete} className="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                Delete Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Exam Modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${editModalOpen ? '' : 'hidden'}`}>
        <div className="flex relative m-auto justify-center self-center p-4 w-full max-w-md max-h-full">

          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Exam
              </h3>
              <button type="button" onClick={() => setEditModalOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="exam-edit-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exam Title</label>
                  <input value={updatedData.exam} onChange={e => setUpdatedData({ ...updatedData, exam: e.target.value })} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Exam name" required />
                </div>
                <div className="col-span-2">
                  <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Date in DD-MM-YY format:</label>
                  <input type="text" value={updatedData.date} onChange={e => setUpdatedData({ ...updatedData, date: e.target.value })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="DD-MM-YY" required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label for="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter batch:</label>

                  <select
                    value={updatedData.batch}
                    onChange={(e) => setUpdatedData({ ...updatedData, batch: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  >
                    <option value="">Select a Batch</option>
                    {batches.map((batch, index) => (
                      <option key={index} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" onClick={handleEdit} className='flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800'>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,300,300"
                  fill="#FFFFFF">
                  <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style={{ "mix-blend-mode": "normal" }}><g transform="scale(4,4)"><path d="M48.09766,3.45313c-1.03516,0 -2.07031,0.375 -2.82812,1.13281l-4.23828,4.24219c-0.78125,-0.78125 -2.05078,-0.78125 -2.82812,0l-5.65625,5.65625c-0.37891,0.37891 -0.58984,0.88281 -0.58984,1.41797c0,0.53125 0.21094,1.03516 0.58984,1.41016l0.04688,0.05078l-27.07812,27.03516c-0.50391,0.50391 -0.80859,1.17188 -0.86719,1.88281l-0.67578,8.39453l-0.70312,4.92188c-0.04687,0.3125 0.05859,0.625 0.28516,0.85156c0.1875,0.1875 0.44141,0.28906 0.70312,0.28906c0.05078,0 0.09766,0 0.14453,-0.00781l4.91797,-0.69922l8.44531,-0.625c0.71875,-0.05078 1.39063,-0.35937 1.89844,-0.86719l27.07813,-27.03906c0.37109,0.34766 0.84766,0.54297 1.35938,0.54297c0.53516,0 1.03516,-0.20703 1.41406,-0.58594l5.65625,-5.65625c0.78125,-0.78125 0.78125,-2.04687 0,-2.82812l4.24609,-4.24219c0.75391,-0.75781 1.16797,-1.76172 1.16797,-2.83203c0,-1.06641 -0.41406,-2.07422 -1.17187,-2.82812l-8.48437,-8.48437c-0.75391,-0.75781 -1.79297,-1.13281 -2.83203,-1.13281zM48.09766,5.43359c0.51953,0 1.03906,0.1875 1.41797,0.56641l8.48438,8.48438c0.37891,0.37891 0.58594,0.87891 0.58594,1.41406c0,0.53516 -0.20703,1.03906 -0.58594,1.41406l-4.24219,4.24609l-11.31641,-11.31641l4.24609,-4.24219c0.375,-0.37891 0.89453,-0.56641 1.41016,-0.56641zM39.61328,10.24219l0.71094,0.70703l12.72656,12.72656l0.70703,0.71094l-1.41406,1.41016c-0.39062,-0.39062 -1.02344,-0.39062 -1.41406,0l-1.41406,1.41797c-0.39062,0.39063 -0.39062,1.02344 0,1.41406l-1.41406,1.41406l-14.14453,-14.14453l1.41406,-1.41406c0.19531,0.19531 0.44922,0.29297 0.70703,0.29297c0.25781,0 0.51172,-0.09766 0.70703,-0.29297l1.41797,-1.41406c0.39063,-0.39062 0.39063,-1.02344 0,-1.41406zM41.03125,14.89844c-0.25781,0 -0.51172,0.09766 -0.70703,0.29297l-1.41797,1.41406c-0.39062,0.39063 -0.39062,1.02344 0,1.41406c0.19531,0.19531 0.45313,0.29297 0.70703,0.29297c0.25781,0 0.51563,-0.09766 0.71094,-0.29297l1.41016,-1.41406c0.39453,-0.39062 0.39453,-1.02344 0,-1.41406c-0.19531,-0.19531 -0.44922,-0.29297 -0.70312,-0.29297zM44.5625,18.4375c-0.25391,0 -0.50781,0.09375 -0.70312,0.29297l-1.41797,1.41016c-0.39062,0.39453 -0.39062,1.02344 0,1.41797c0.19531,0.19141 0.45313,0.28906 0.71094,0.28906c0.25391,0 0.51172,-0.09766 0.70703,-0.28906l1.41016,-1.41797c0.39453,-0.39062 0.39453,-1.01953 0,-1.41016c-0.19531,-0.19922 -0.44922,-0.29297 -0.70703,-0.29297zM34.01172,18.77734l11.3125,11.31641l-26.29687,26.25391l-0.95312,-4.76562l16.58984,-16.58984c0.39063,-0.39062 0.39063,-1.02344 0,-1.41406c-0.39062,-0.39062 -1.01953,-0.39062 -1.41406,0l-16.59375,16.59375l-2.35547,-0.47266l-0.47266,-2.35937l13.76563,-13.76172c0.39453,-0.39453 0.39453,-1.02344 0,-1.41797c-0.39062,-0.39062 -1.01953,-0.39062 -1.41016,0l-13.76562,13.76563l-4.66406,-0.92969zM48.10156,21.96875c-0.25781,0 -0.51172,0.09766 -0.70703,0.29688l-1.41406,1.41016c-0.39062,0.39453 -0.39062,1.02344 0,1.41797c0.19531,0.19141 0.44922,0.29297 0.70703,0.29297c0.25781,0 0.51172,-0.10156 0.70703,-0.29297l1.41406,-1.41797c0.39063,-0.39062 0.39063,-1.01953 0,-1.41016c-0.19531,-0.19922 -0.44922,-0.29687 -0.70703,-0.29687zM32.54688,26.21484c-0.25781,0 -0.51172,0.09766 -0.70703,0.28906l-2.82812,2.82813c-0.39453,0.39453 -0.39453,1.02344 0,1.41797c0.19141,0.19141 0.44922,0.29297 0.70703,0.29297c0.25391,0 0.51172,-0.10156 0.70313,-0.29297l2.82813,-2.82812c0.39453,-0.39453 0.39453,-1.02344 0,-1.41797c-0.19531,-0.19531 -0.44922,-0.29297 -0.70312,-0.28906zM6.60938,46.80469l5.28516,1.05469l0.57422,2.88672c0.08203,0.39453 0.39063,0.70313 0.78516,0.78125l2.88281,0.57813l1.06641,5.33594l-7.60937,0.55859l-3.59375,-3.58984z"></path></g></g>
                </svg> Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
