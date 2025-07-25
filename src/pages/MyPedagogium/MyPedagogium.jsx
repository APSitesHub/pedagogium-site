import axios from 'axios';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import {
  LoginFormText,
  LoginLogo,
  StreamAuthTextHello,
  StreamSection,
} from 'components/Stream/Stream.styled';
import { Formik } from 'formik';
import {
  AdminFormBtn,
  AdminInput,
  AdminInputNote,
  LoginForm,
} from 'pages/Streams/AdminPanel/AdminPanel.styled';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { MyPlatform } from './My Platform/MyPlatform';
import { MyPedagogiumPanel } from './MyPedagogiumPanel/MyPedagogiumPanel';
import { LoginErrorNote } from './MyPedagogiumPanel/MyPedagogiumPanel.styled';

const MyPedagogium = () => {
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [timetable, setTimetable] = useState({});
  const [user, setUser] = useState({});
  const [platformLink, setPlatformLink] = useState(
    `https://online.ap.education/`
  );
  const [isUserInfoIncorrect, setIsUserInfoIncorrect] = useState(false);

  axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

  useEffect(() => {
    document.title = 'My Pedagogium | Pedagogium';

    const refreshToken = async () => {
      
      const mail = localStorage.getItem('mail');
      try {
        if (!mail) {
          console.log('token refresher interrupted - no info about user');
          return;
        }
        const res = await axios.post('/pedagogium-users/refresh', {
          mail,
        });
        setIsUserLogged(isLogged => (isLogged = true));
        setUser(user => (user = { ...res.data.user }));
      } catch (error) {
        console.log(error);
      }
    };
    refreshToken();

    if (!user?.mail) {
      return;
    }

    const getTimetable = async () => {
      console.log('timetable getter');
      try {
        const res = await axios.get('/pedagogium-timetable');
        console.log(res);
        setTimetable(timetable => (timetable = res.data));
      } catch (error) {
        console.log(error);
      }
    };
    getTimetable();

    const setIframeLinks = async () => {
      const authLink = user.platformToken
        ? `https://online.ap.education/Account/LoginByToken?token=${
            user.platformToken
          }&redirectUrl=${encodeURIComponent(
            `https://online.ap.education/cabinet/student/lessons`
          )}`
        : user.mail.includes('teacher')
        ? `https://online.ap.education/cabinet/school/marathons/folder/3547`
        : `https://online.ap.education/cabinet/student/lessons`;

      setPlatformLink(link => (link = authLink));
    };

    setIframeLinks();
  }, [user.mail, user.pupilId, user.marathonNumber, user.platformToken]);

  const setAuthToken = token => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
    values.mail = values.mail.toLowerCase().trim().trimStart();
    values.password = values.password.trim().trimStart();
    try {
      const response = await axios.post('/pedagogium-users/login', values);
      console.log(response);

      setAuthToken(response.data.token);
      setIsUserLogged(isLogged => (isLogged = true));
      setUser(user => (user = { ...response.data.user }));
      localStorage.setItem('mail', values.mail);
      setIsUserInfoIncorrect(false);
      resetForm();
    } catch (error) {
      error.response.status === 401 && setIsUserInfoIncorrect(true);
      console.error(error);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('mail');
    setAuthToken('');
    setUser(user => (user = {}));
    setIsUserLogged(isLogged => (isLogged = false));
  };

  return (
    <StreamSection>
      {!isUserLogged ? (
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
              style={isUserInfoIncorrect ? { opacity: '1' } : { opacity: '0' }}
            >
              Password or email is incorrect!
            </LoginErrorNote>
          </LoginForm>
        </Formik>
      ) : (
        <>
          <MyPedagogiumPanel
            user={{
              ...user,
              visited: [
                ...new Set(
                  user.visited.map(date => date.replace(' lesson', ''))
                ),
              ],
            }}
            link={platformLink}
            timetable={timetable}
            handleLogout={handleLogout}
          />
          <MyPlatform platformLink={platformLink} />
        </>
      )}
    </StreamSection>
  );
};

export default MyPedagogium;
