import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInSuccess, signInStart, signInFailure } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';

const SignIn = () => {
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { handleSubmit, handleChange, handleBlur, errors, values, touched } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(signInStart());
        const response = await fetch('http://localhost:5500/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (!response.ok) {
          dispatch(signInFailure(data.message || 'Sign in failed. Please try again.'));
          toast.error(data.message || 'Sign in failed. Please try again.');
          return;
        }

        dispatch(signInSuccess(data));
        toast.success('Sign in successful');
        navigate('/');
      } catch (error) {
        dispatch(signInFailure('Sign in failed. Please try again.'));
        toast.error('Sign in failed. Please try again.');
      }
    },
  });

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='flex flex-col w-full max-w-md p-6 bg-white shadow-md rounded-md'>
        <h2 className='text-2xl font-bold text-center mb-6'>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <input
              type="text"
              placeholder='Email'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              id='email'
              name='email'
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none'
            />
            {errors.email && touched.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className='mb-6'>
            <input
              type="password"
              placeholder='Password'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              id='password'
              name='password'
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none'
            />
            {errors.password && touched.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className='w-full p-2 bg-blue-600 text-white rounded-lg focus:outline-none disabled:bg-blue-400'
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <svg aria-hidden="true" className="w-6 h-6 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
          <button type="button" className='w-full p-2 mt-4 bg-red-600 text-white rounded-lg focus:outline-none'>
            <OAuth/>
          </button>
        </form>
        <div className='mt-6 text-center'>
          <p className='text-sm'>
            Don't have an account? <Link to='/signup' className='text-blue-600'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
