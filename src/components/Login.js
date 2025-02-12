import React, { useEffect } from 'react';
import '../App.css';
import Logo from '../images/logo.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Cookie from 'universal-cookie';
const API_URL = process.env.REACT_APP_API_URL
const cookie = new Cookie();
const loginRequest = async (email, password, remember) => {
    return axios.post(`${API_URL}/admin/login`, { email, password, remember }, { headers: { 'Content-Type': 'application/json' } })
        .then(response => response.data)
        .catch(error => {
            throw error.response.data;
        });
};

const Login = () => {
    const [email, setEmail] = React.useState()
    const [password, setPassword] = React.useState()
    const [remember, setRemember] = React.useState(false)

    useEffect(() => {
        if(localStorage.getItem("email") === "admin@nctb.com") {
                 window.location.href = '/dashboard';
        }
    })
    const handleSubmit = function (e) {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return
        }

        // Use toast.promise to display toast messages based on the promise's resolution
        toast.promise(loginRequest(email, password, remember), {
            pending: {
                render({data}){
                  return "Logging in..."
                },
                // other options
                icon: "🟢",
              },
            success: {render(response) {
                localStorage.setItem("email", "admin@nctb.com")
                window.location.href = '/dashboard'
               return <div>Logged in successfully! Redirecting...</div>
            }},
            error:  {
                render({data}){
                  // When the promise rejects, data will contain the error
                  return <div>{data.message}</div>
                      }    
                      }
        
        })
    }
    return (
        <>
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
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                        <img className="w-8 h-8 mr-2 m-auto" src={Logo} alt="logo" />
                        জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (এনসিটিবি)
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Sign in to dashboard
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                                    <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-50 focus:outline-none focus:ring-0  border border-gray-300 text-gray-900 rounded-lg focus:ring-green-950 focus:border-green-600 block w-full p-2.5 " placeholder="name@company.com" required="" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                    <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} id="password" placeholder="••••••••" className="bg-gray-50 focus:outline-none focus:ring-0  border border-gray-300 text-gray-900 rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:border-green-500" required="" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" checked={remember} onChange={e => setRemember(!remember)} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-green-600 dark:ring-offset-gray-800" required="" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" onClick={handleSubmit} className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  ">Sign in</button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Login