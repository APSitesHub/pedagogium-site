import axios from 'axios';
import { StreamSection } from 'pages/TeacherPage/TeacherPage.styled';
import { useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

const Teacher = () => {
  const wakeupRequest = async () => {
    try {
      const wake = await axios.get('/');
      console.log(wake.data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    wakeupRequest();
  }, []);

  return (
    <StreamSection>
      <Outlet />
    </StreamSection>
  );
};

export default Teacher;
