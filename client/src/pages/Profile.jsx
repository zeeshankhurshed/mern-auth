import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [image, setImage] = useState(undefined);
  const [imagePerc, setImagePerc] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: '',
  });

  useEffect(() => {
    if (currentUser && currentUser.user) {
      setFormData({
        username: currentUser.user.username || '',
        email: currentUser.user.email || '',
        password: '',
        profilePicture: currentUser.user.profilePicture || '',
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePerc(Math.round(progress));
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        setImageError(true);
        toast.error('Error uploading image');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            profilePicture: downloadURL,
          }));
          toast.success('Image uploaded successfully');
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.user || !currentUser.user._id) {
      console.error('User is not authenticated or currentUser is not properly set.');
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser.user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`, // Assuming token is stored in currentUser
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        toast.error(data.message || 'Failed to update profile');
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success('Profile updated successfully');
    } catch (error) {
      dispatch(updateUserFailure(error));
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser || !currentUser.user || !currentUser.user._id) {
      console.error('User is not authenticated or currentUser is not properly set.');
      return;
    }
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.user._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        toast.error(data.message || 'Failed to delete profile');
        return;
      }
      dispatch(deleteUserSuccess());
      toast.success('Profile deleted successfully');
    } catch (error) {
      dispatch(deleteUserFailure(error));
      toast.error('Failed to delete profile');
    }
  };

const handlSignOut=async()=>{
  try {
    await fetch('/api/auth/signout');
    dispatch(signOut());
  } catch (error) {
    console.log(error);
  }
}

  return (
    <div className="p-3 max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold text-center my-7">Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {formData.profilePicture ? (
          <img
            src={formData.profilePicture}
            alt="profile"
            className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
            onClick={() => fileRef.current.click()}
          />
        ) : (
          <div
            className="h-24 w-24 self-center cursor-pointer rounded-full bg-gray-200 flex items-center justify-center mt-2"
            onClick={() => fileRef.current.click()}
          >
            <span>Profile</span>
          </div>
        )}
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">Error uploading</span>
          ) : imagePerc > 0 && imagePerc < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePerc}%`}</span>
          ) : imagePerc === 100 ? (
            <span className="text-green-700">Image Uploaded Successfully</span>
          ) : (
            ''
          )}
        </p>
        <input
          value={formData.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          value={formData.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          value={formData.password}
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button type="submit" className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading....': 'Update'}
        </button>
      </form>
      <div className="flex justify-between items-center mt-5">
        <span onClick={handleDeleteAccount} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handlSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
