import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import EditSVG from './svgs/edit.svg'
import DeleteSVG from './svgs/delete.svg'
const API_URL = process.env.REACT_APP_API_URL

const Edit = () => {
    const [examModalOpen, setExamModalOpen] = React.useState(false);

    // modal states
    const [yearModal, setYearModal] = useState(false)
    const [classModal, setClassModal] = useState(false)
    const [mediumModal, setMediumModal] = useState(false)
    const [versionModal, setVersionModal] = useState(false);

    // data
      const [year, setYear] = useState('');
      const [className, setClassName] = useState('');
      const [medium, setMedium] = useState('');
      const [version, setVersion] = useState('');

      const [yearlist, setYearList] = useState([])
      const [classList, setClassList] = useState([])
      const [mediumList, setMediumList] = useState([])
      const [versionList, setVersionList] = useState([])

      useEffect(() => {
        // Simulating fetching data from an API
        const fetchData = async () => {
          try {
            const response = await fetch(`${API_URL}/year`); // Replace with your actual API endpoint
            const data = await response.json();
            setYearList(data);
            const response2 = await fetch(`${API_URL}/class`); // Replace with your actual API endpoint
            const data2 = await response2.json();
            setClassList(data2);
            const response3 = await fetch(`${API_URL}/medium`); // Replace with your actual API endpoint
            const data3 = await response3.json();
            setMediumList(data3);
            const response4 = await fetch(`${API_URL}/version`); // Replace with your actual API endpoint
            const data4 = await response4.json();
            setVersionList(data4);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, []);


      const handleSubmit = () => {
        if (!year ) {
          return toast.error("Please fill in all the fields!")
        }
    
        axios.post(`${API_URL}/addyear`, { year }, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
          if (response.data.success === true) {
            toast.success("Year added successfully!");
            setYearModal(false);
            setYear('');
            axios.get(`${API_URL}/year`)
              .then(response => {
                setYearList(response.data)
              })
              .catch(error => {
                console.error(error)
              })
          }
          else {
            toast.error(response.data);
          }
        })
          .catch(response => toast.error('Year already exists'))
      }

      const handleClassSubmit = () => {
        if (!className ) {
          return toast.error("Please fill in all the fields!")
        }
    
        axios.post(`${API_URL}/addclass`, { className }, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
          if (response.data.success === true) {
            toast.success("Year added successfully!");
            setClassModal(false);
            setClassName('');
            axios.get(`${API_URL}/class`)
              .then(response => {
                setClassList(response.data)
              })
              .catch(error => {
                console.error(error)
              })
          }
          else {
            toast.error(response.data);
          }
        })
          .catch(response => toast.error('Year already exists'))
      }

      const handleMediumSubmit = () => {
        if (!medium ) {
          return toast.error("Please fill in all the fields!")
        }
    
        axios.post(`${API_URL}/addmedium`, { medium }, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
          if (response.data.success === true) {
            toast.success("Year added successfully!");
            setMediumModal(false);
            setMedium('');
            axios.get(`${API_URL}/medium`)
              .then(response => {
                setMediumList(response.data)
              })
              .catch(error => {
                console.error(error)
              })
          }
          else {
            toast.error(response.data);
          }
        })
          .catch(response => toast.error('Medium already exists'))
      }

      const handleVersionSubmit = () => {
        if (!version ) {
          return toast.error("Please fill in all the fields!")
        }
    
        axios.post(`${API_URL}/addversion`, { version }, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
          if (response.data.success === true) {
            toast.success("Year added successfully!");
            setVersionModal(false);
            setVersion('');
            axios.get(`${API_URL}/version`)
              .then(response => {
                setVersionList(response.data)
              })
              .catch(error => {
                console.error(error)
              })
          }
          else {
            toast.error(response.data);
          }
        })
          .catch(response => toast.error('Version already exists'))
      }
  
  return (
    <div className='mx-20'>
      <Navbar></Navbar>
      <br />
      <br />

      {/* new year modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${yearModal ? '' : 'hidden'}`}>
        <div className="flex relative m-auto justify-center self-center p-4 w-full max-w-md max-h-full">

          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                নতুন বছর সংযুক্তকরণ 
              </h3>
              <button type="button" onClick={() => setYearModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                  <input value={year} onChange={e => setYear(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="২০২৫" required />
                </div>
              </div>
              <button type="submit" onClick={handleSubmit} className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
               Add year
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* add new class modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${classModal ? '' : 'hidden'}`}>
        <div className="flex relative m-auto justify-center self-center p-4 w-full max-w-md max-h-full">

          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                নতুন শ্রেণি সংযুক্তকরণ 
              </h3>
              <button type="button" onClick={() => setClassModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Class</label>
                  <input value={className} onChange={e => setClassName(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="১ম শ্রেণি" required />
                </div>
              </div>
              <button type="submit" onClick={handleClassSubmit} className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
               Add class
              </button>
            </div>
          </div>
        </div>
      </div>

            {/* add new medium modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${mediumModal ? '' : 'hidden'}`}>
        <div className="flex relative m-auto justify-center self-center p-4 w-full max-w-md max-h-full">

          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                নতুন মাধ্যম সংযুক্তকরণ 
              </h3>
              <button type="button" onClick={() => setMediumModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Medium</label>
                  <input value={medium} onChange={e => setMedium(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="প্রাথমিক" required />
                </div>
              </div>
              <button type="submit" onClick={handleMediumSubmit} className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
               Add Medium
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${versionModal ? '' : 'hidden'}`}>
        <div className="flex relative m-auto justify-center self-center p-4 w-full max-w-md max-h-full">

          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                নতুণ ভাষা সংযুক্তকরণ 
              </h3>
              <button type="button" onClick={() => setVersionModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ভাষা</label>
                  <input value={version} onChange={e => setVersion(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="বাংলা" required />
                </div>
              </div>
              <button type="submit" onClick={handleVersionSubmit} className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
               Add version
              </button>
            </div>
          </div>
        </div>
      </div>

      <br />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className='bg-gray-200 p-4 rounded-xl'>
            <button data-modal-target="crud-modal" onClick={() => setYearModal(true)} data-modal-toggle="crud-modal" className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800" type="button">
                  <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  নতুন বছর সংযুক্ত
                </button>
                <br />
                <p>Existing Years</p>
                {yearlist.map((item, index) => (
                 <p className='bg-white my-2 rounded-2xl p-4' key={index}>{item.year}</p>
                ))}
        </div>
        <div className='bg-gray-200 p-4 rounded-xl'>
            <button data-modal-target="crud-modal" onClick={() => setClassModal(true)} data-modal-toggle="crud-modal" className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800" type="button">
                  <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  নতুন শ্রেণি সংযুক্ত
                </button>
                <br />
                <p>Existing Classes</p>
                {classList.map((item, index) => (
                 <p key={index}>{item.className}</p>
                ))}
        </div>
        <div className='bg-gray-200 p-4 rounded-xl'>
            <button data-modal-target="crud-modal" onClick={() => setMediumModal(true)} data-modal-toggle="crud-modal" className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800" type="button">
                  <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  নতুন মাধ্যম সংযুক্ত
                </button>
                <br />
                <p>Existing Mediums</p>
                {mediumList.map((item, index) => (
                 <p key={index}>{item.medium}</p>
                ))}
        </div>
        <div className='bg-gray-200 p-4 rounded-xl'>
            <button data-modal-target="crud-modal" onClick={() => setVersionModal(true)} data-modal-toggle="crud-modal" className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800" type="button">
                  <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  নতুন ভাষা সংযুক্ত
                </button>
                <br />
                <p>Existing versions</p>
                {versionList.map((item, index) => (
                 <p key={index}>{item.version}</p>
                ))}
        </div>
        </div>
    </div>
  );
};

export default Edit;