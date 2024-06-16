import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto py-6'>
        <Link to='/'>
          <h2 className='font-bold text-3xl'>Auth App</h2>
        </Link>
        <ul className='flex items-center gap-4'>
          <Link to='/'>
            <li className='font-semibold'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='font-semibold'>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser && currentUser.user ? (
              <img
                src={currentUser.user.profilePicture}
                alt='Profile'
                className='h-7 rounded-full object-cover'
              />
            ) : (
              <li className='font-semibold'>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Header;
