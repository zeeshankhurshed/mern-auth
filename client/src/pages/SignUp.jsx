import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OAuth from '../components/OAuth';
const SignUp = () => {
  const[loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const { handleSubmit, handleChange, handleBlur, errors, values, touched } = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email format').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5500/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        toast.success('Sign up successful');
        setLoading(false);
        navigate('/signin')
      } catch (error) {
        console.error('Error:', error);
        toast.error('Sign up failed. Please try again.');
        setLoading(false);
      }
    },
  });
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='flex flex-col w-full max-w-md p-6 bg-white shadow-md rounded-md'>
        <h2 className='font-bold text-2xl text-center'>Sign Up</h2>
        <form className='w-[100%]' onSubmit={handleSubmit}>
          <div className='mx-3'>
            <div>
              <input
                type="text"
                placeholder='UserName....'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                id='username'
                name='username'
                className='w-full focus:outline-none border border-1 rounded-lg p-2 my-6 '
              />
              <p className="text-red-700">{errors.username && touched.username ? errors.username : null}</p>
            </div>
            <div>
              <input
                type="text"
                placeholder='Email....'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                id='email'
                name='email'
                className='w-full focus:outline-none border border-1 rounded-lg p-2  '
              />
              <p className="text-red-700">{errors.email && touched.email ? errors.email : null}</p>
            </div>
            <div>
              <input
                type="password"
                placeholder='Password....'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                id='password'
                name='password'
                className='w-full focus:outline-none border border-1 rounded-lg p-2 my-6 '
              />
              <p className="text-red-700">{errors.password && touched.password ? errors.password : null}</p>
            </div>
            <button type="submit" className='w-full focus:outline-none border border-1 rounded-lg p-2 bg-gray-700 text-white uppercase opacity-90 disabled:opacity-80'>
              {loading ? (
                <div role="status">
                  <svg aria-hidden="true" className="w-8 h-8 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
            <button type="button" className='w-full focus:outline-none border border-1 rounded-lg p-2 bg-red-700 text-white my-6 uppercase'>
              <OAuth/>
            </button>
          </div>
        </form>
        <div className=''>
          <p className='mb-6 text-sm '>Have an account? <Link to='/signin' ><span className='text-blue-600 '>Sign In</span></Link> </p>
        </div>
      </div>
    </div>
  )
}
export default SignUp;
//1:54