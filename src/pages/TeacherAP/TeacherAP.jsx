import { useEffect, useState } from 'react';
import TeacherAPPanel from './TeacherAPPanel/TeacherAPPanel';
import axios from 'axios';
import {
  Label,
  LeftFormBackgroundStar,
  RightFormBackgroundStar,
  LoginErrorNote,
  LoginFormText,
  StreamSection,
} from './TeacherAP.styled';
import { Formik } from 'formik';
import {
  AdminFormBtn,
  AdminInput,
  AdminInputNote,
  LoginForm,
} from 'pages/Streams/AdminPanel/AdminPanel.styled';
import * as yup from 'yup';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

const TeacherAP = () => {
  const [isTeacherLogged, setIsTeacherLogged] = useState(false);
  const [isTeacherInfoIncorrect, setIsTeacherInfoIncorrect] = useState(false);
  const [iframeLink, setIframeLink] = useState('');

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await axios.post('/pedagogium-teachers/refresh', {
          login: localStorage.getItem('login'),
        });
        localStorage.setItem('token', res.data.newToken);
        setIsTeacherLogged(isLogged => (isLogged = true));
        localStorage.setItem('userName', res.data.teacher.name);
        setPlatformLink(res.data.teacher.platformToken);
      } catch (error) {
        console.log(error);
      }
    };
    refreshToken();
  }, []);

  const handleLoginSubmit = async (values, { resetForm }) => {
    values.login = values.login.toLowerCase().trim().trimStart();
    values.password = values.password.trim().trimStart();
    try {
      const response = await axios.post('/pedagogium-teachers/login', values);
      setAuthToken(response.data.token);
      setIsTeacherLogged(isLogged => (isLogged = true));
      localStorage.setItem('userName', response.data.teacher.name);
      localStorage.setItem('login', values.login);
      localStorage.setItem('token', response.data.token);
      setIsTeacherInfoIncorrect(false);
      setPlatformLink(response.data.teacher.platformToken);
      resetForm();
    } catch (error) {
      error.response.status === 401 && setIsTeacherInfoIncorrect(true);
      console.error(error);
    }
  };

  const setPlatformLink = token => {
    setIframeLink(
      `https://online.ap.education/LoginByToken?token=${token}&redirectUrl=${encodeURIComponent(
        `https://https://online.ap.education/cabinet/school/marathons/list`
      )}`
    );
  };

  const setAuthToken = token => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const initialLoginValues = {
    login: '',
    password: '',
  };

  const loginSchema = yup.object().shape({
    login: yup
      .string()
      .required('Podaj login, którego używasz na naszej platformie!'),
    password: yup
      .string()
      .required(
        'Wprowadź hasło, którego używasz do logowania na naszej platformie!'
      ),
  });

  return (
    <StreamSection>
      {!isTeacherLogged ? (
        <Formik
          initialValues={initialLoginValues}
          onSubmit={handleLoginSubmit}
          validationSchema={loginSchema}
        >
          <LoginForm>
            <LeftFormBackgroundStar />
            <RightFormBackgroundStar />
            <LoginFormText>
              Cześć!
              <br />
              Ta strona jest niedostępna dla nieautoryzowanych użytkowników. Ale
              jeśli masz dostęp do naszej platformy, masz też dostęp do tej
              strony. Wprowadź dane, których używasz do logowania na platformie.
            </LoginFormText>
            <Label>
              <AdminInput
                type="text"
                name="login"
                placeholder="Login"
                onBlur={() => setIsTeacherInfoIncorrect(false)}
              />
              <AdminInputNote component="p" name="login" type="text" />
            </Label>
            <Label>
              <AdminInput
                type="password"
                name="password"
                placeholder="Hasło"
                onBlur={() => setIsTeacherInfoIncorrect(false)}
              />
              <AdminInputNote component="p" name="password" />
            </Label>
            <AdminFormBtn type="submit">Zaloguj się</AdminFormBtn>
            <LoginErrorNote
              style={
                isTeacherInfoIncorrect ? { opacity: '1' } : { opacity: '0' }
              }
            >
              Login lub hasło zostały wprowadzone nieprawidłowo!
            </LoginErrorNote>
          </LoginForm>
        </Formik>
      ) : (
        <>
          <iframe
            id="platform-window"
            title="platform-pin"
            src={iframeLink}
            width="100%"
            height="100%"
            allow="microphone *"
          ></iframe>
          <TeacherAPPanel />
        </>
      )}
    </StreamSection>
  );
};

export default TeacherAP;
