import axios from 'axios';
import { StreamsBackgroundWrapper } from 'components/BackgroundWrapper/BackgroundWrappers';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import { Formik } from 'formik';
import { LoginErrorNote } from 'pages/MyPedagogium/MyPedagogiumPanel/MyPedagogiumPanel.styled';
import { useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import {
  LoginFormText,
  LoginLogo,
  StreamAuthTextHello,
} from '../../components/Stream/Stream.styled';
import {
  AdminFormBtn,
  AdminInput,
  AdminInputNote,
  LoginForm,
} from '../Streams/AdminPanel/AdminPanel.styled';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

const Teacher = () => {
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [isUserInfoIncorrect, setIsUserInfoIncorrect] = useState(false);
  const location = useLocation();

  const wakeupRequest = async () => {
    try {
      const wake = await axios.get('/');
      console.log(wake.data);
    } catch (error) {
      console.log(error);
    }
  };

  const initialLoginValues = {
    mail: '',
    password: '',
  };

  const loginSchema = yup.object().shape({
    mail: yup.string().required('Enter your email!'),
    password: yup.string().required('Enter your password!'),
  });

  const handleLoginSubmit = async (values, { resetForm }) => {
    const mail = values.mail.toLowerCase().trim();
    const password = values.password.trim();

    try {
      const response = await axios.post('/pedagogium-teachers/login', {
        login: mail,
        password,
      });

      setIsUserLogged(true);
      localStorage.setItem('mail', mail);
      localStorage.setItem('userName', response.data.teacher.name);
      resetForm();
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error('Teacher login failed:', error);
      }
    }
  };

  useLayoutEffect(() => {
    wakeupRequest();

    const refreshToken = async () => {
      console.log('token refresher');
      try {
        const response = await axios.post('/pedagogium-teachers/refresh', {
          login: localStorage.getItem('mail'),
        });
        localStorage.setItem('userName', response.data.teacher.name);

        setIsUserLogged(true);
      } catch (error) {
        if (error?.response?.status !== 401) {
          console.error('Teacher refresh failed:', error);
        }
      }
    };
    refreshToken();

    document.documentElement.style.overflow = 'hidden';
  }, []);

  return (
    <>
      <StreamsBackgroundWrapper>
        {!isUserLogged && !location.pathname.includes('-chat') ? (
          <Formik
            initialValues={initialLoginValues}
            onSubmit={handleLoginSubmit}
            validationSchema={loginSchema}
          >
            <LoginForm>
              <LoginLogo />
              <LoginFormText>
                <StreamAuthTextHello>Hello!</StreamAuthTextHello>
                Our website is not available without authorization. Please enter
                your email and password.
              </LoginFormText>
              <Label>
                <AdminInput
                  type="text"
                  name="mail"
                  placeholder="Email"
                  onBlur={() => setIsUserInfoIncorrect(false)}
                />
                <AdminInputNote component="p" name="mail" type="email" />
              </Label>
              <Label>
                <AdminInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  onBlur={() => setIsUserInfoIncorrect(false)}
                />
                <AdminInputNote component="p" name="password" />
              </Label>
              <AdminFormBtn type="submit">
                <FormBtnText>Log In</FormBtnText>
              </AdminFormBtn>
              <LoginErrorNote
                style={
                  isUserInfoIncorrect ? { opacity: '1' } : { opacity: '0' }
                }
              >
                Password or email is incorrect!
              </LoginErrorNote>
            </LoginForm>
          </Formik>
        ) : (
          <Outlet />
        )}
      </StreamsBackgroundWrapper>
    </>
  );
};

export default Teacher;
