import axios from 'axios';
import { StreamsBackgroundWrapper } from 'components/BackgroundWrapper/BackgroundWrappers';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import { Loader } from 'components/SharedLayout/Loaders/Loader';
import { LoaderWrapper } from 'components/SharedLayout/Loaders/Loader.styled';
import { Formik } from 'formik';
import { nanoid } from 'nanoid';
import { LoginErrorNote } from 'pages/MyPedagogium/MyPedagogiumPanel/MyPedagogiumPanel.styled';
import { useEffect, useLayoutEffect, useState } from 'react';
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
} from './AdminPanel/AdminPanel.styled';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

const setAuthToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const Streams = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [isUserInfoIncorrect, setIsUserInfoIncorrect] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const location = useLocation();

  console.log(location);

  const wakeupRequest = async () => {
    try {
      const wake = await axios.get('/');
      console.log(wake.data);
    } catch (error) {
      console.log(error);
    }
  };

  const detectUser = async () => {
    try {
      const id = localStorage.getItem('userID');
      const user = await axios.get(
        `https://ap-chat-server.onrender.com/pedagogium-users/${id}`
      );
      console.log(user.data, 'detect');
      setCurrentUser(
        currentUser =>
          (currentUser = user.data || {
            username: 'User Is Not Logged In',
            isBanned: false,
            userIP: 'no ip',
          })
      );
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

  const finalizeLogin = (data, userKey) => {
    setAuthToken(data.token);
    setIsUserLogged(true);
    setCurrentUser(data[userKey]);

    localStorage.setItem('userID', localStorage.getItem('userID') || nanoid(8));
    localStorage.setItem(
      'userName',
      `${data[userKey]?.name} ${userKey === 'teacher' ? ' (teacher)' : ''}` ||
        ''
    );
    setIsUserInfoIncorrect(false);
  };

  const handleLoginSubmit = async (values, { resetForm }) => {
    const mail = values.mail.toLowerCase().trim();
    const password = values.password.trim();

    try {
      const teacherLogin = await axios.post('/pedagogium-teachers/login', {
        login: mail,
        password,
      });
      setIsTeacher(true);
      localStorage.setItem('mail', mail);
      finalizeLogin(teacherLogin.data, 'teacher');
      resetForm();

      return;
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error('Teacher login failed:', error);
        return;
      }
    }

    try {
      const userLogin = await axios.post('/pedagogium-users/login/lesson', {
        mail,
        password,
      });
      setIsTeacher(false);
      localStorage.setItem('mail', mail);
      finalizeLogin(userLogin.data, 'user');
      resetForm();
    } catch (error) {
      if (error?.response?.status === 401) {
        setIsUserInfoIncorrect(true);
      }
      console.error('User login failed:', error);
    }
  };

  useLayoutEffect(() => {
    wakeupRequest();

    const getLinksRequest = async () => {
      try {
        setIsLoading(isLoading => (isLoading = true));
        setLinks((await axios.get('/unilinks')).data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(isLoading => (isLoading = false));
      }
    };
    getLinksRequest();

    const refreshToken = async () => {
      console.log('token refresher');
      try {
        const teacherLogin = await axios.post('/pedagogium-teachers/refresh', {
          login: localStorage.getItem('mail'),
        });

        setIsTeacher(true);
        finalizeLogin(teacherLogin.data, 'teacher');
        return;
      } catch (error) {
        if (error?.response?.status !== 401) {
          console.error('Teacher refresh failed:', error);
          return;
        }
      }

      try {
        const userLogin = await axios.post('/pedagogium-users/refresh/lesson', {
          mail: localStorage.getItem('mail'),
        });

        setIsTeacher(false);
        finalizeLogin(userLogin.data, 'user');
      } catch (error) {
        console.log(error);
      }
    };
    refreshToken();
  }, []);

  useEffect(() => {
    detectUser();
  }, [isLoading]);

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
          <Outlet context={[links, isLoading, currentUser, isTeacher]} />
        )}

        {isLoading && (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        )}
      </StreamsBackgroundWrapper>
    </>
  );
};

export default Streams;
