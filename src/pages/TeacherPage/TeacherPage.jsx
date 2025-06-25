import useSize from '@react-hook/size';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { HostKahoots } from './HostKahoots/HostKahoots';
import { LessonInfoBox } from './NameInput/NameInput.styled';
import { Platform } from './Platform/Platform';
import { TeacherChat } from './TeacherChat/TeacherChat';
import {
  BoxHideLeftSwitch,
  BoxHideRightSwitch,
  // ViewerBtn,
  // ViewerLogo,
  // WhiteBoardBtn,
  // WhiteBoardLogo,
  InputBtn,
  InputButtonBox,
  KahootBtn,
  KahootLogo,
  // PlatformBtn,
  // PlatformLogo,
  TeacherButtonBox,
  TeacherButtonBoxHideSwitch,
} from './TeacherPage.styled';
import {
  AdminInput,
  AdminInputNote,
} from '../Streams/UserAdminPanel/UserAdminPanel.styled';
import { TeacherQuizInput } from './TeacherQuiz/TeacherQuizInput';
import { TeacherQuizOptions } from './TeacherQuiz/TeacherQuizOptions';
import { TeacherQuizTrueFalse } from './TeacherQuiz/TeacherQuizTrueFalse';
// import { Viewer } from './Viewer/Viewer';
// import { WhiteBoard } from './WhiteBoard/WhiteBoard';
import axios from 'axios';
import NotFound from 'pages/NotFound/NotFound';
import { QRCodeModal } from './TeacherQuiz/TeacherQR';
import { TeacherQuizFeedback } from './TeacherQuiz/TeacherQuizFeedback';
import { Formik } from 'formik';
import {
  AdminFormBtn,
  LoginForm,
} from 'pages/Streams/AdminPanel/AdminPanel.styled';
import { LoginLogo } from 'components/Stream/Stream.styled';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import { Loader } from 'components/SharedLayout/Loaders/Loader';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';
// axios.defaults.baseURL = 'http://localhost:3001';

const setAuthToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const TeacherPage = () => {
  const { group } = useParams();
  const [isGroupExist, setIsGroupExist] = useState(false);
  // eslint-disable-next-line
  const [isWhiteBoardOpen, setIsWhiteBoardOpen] = useState(false);
  // eslint-disable-next-line
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  // eslint-disable-next-line
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  // eslint-disable-next-line
  const [isKahootOpen, setIsKahootOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isQuizInputOpen, setIsQuizInputOpen] = useState(false);
  const [isQuizOptionsOpen, setIsQuizOptionsOpen] = useState(false);
  const [isQuizTrueFalseOpen, setIsQuizTrueFalseOpen] = useState(false);
  const [isQuizFeedbackOpen, setIsQuizFeedbackOpen] = useState(false);
  const [isButtonBoxOpen, setIsButtonBoxOpen] = useState(true);
  const [isOpenedLast, setIsOpenedLast] = useState('');
  const [isInputButtonBoxOpen, setIsInputButtonBoxOpen] = useState(false);
  // eslint-disable-next-line
  const [width, height] = useSize(document.body);
  const [isLogined, setIsLogined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isKahootsWasOpened, setIsKahootsWasOpened] = useState(false);
  const [isCorrectLessonInfo, setIsCorrectLessonInfo] = useState(false);
  const questionID = useRef(nanoid(5));

  console.log('group:', group);

  const initialLoginValue = {
    login: '',
    password: '',
    lessonName: '',
    lessonNumber: '',
  };

  const initialLessonValue = {
    lessonName: localStorage.getItem('lessonName') || '',
    lessonNumber: localStorage.getItem('lessonNumber') || '',
  };

  const loginSchema = yup.object().shape({
    login: yup.string().required('Wpisz login'),
    password: yup.string().required('Wpisz hasło'),
    lessonName: yup.string().required('Wpisz nazwę lekcji'),
    lessonNumber: yup.string().required('Wpisz numer lekcji'),
  });

  const lessonSchema = yup.object().shape({
    lessonName: yup.string().required('Wpisz nazwę lekcji'),
    lessonNumber: yup.string().required('Wpisz numer lekcji'),
  });

  const handleLoginSubmit = async (values, { resetForm }) => {
    console.log('login');

    try {
      const response = await axios.post('/pedagogium-teachers/login', {
        login: values.login,
        password: values.password,
      });

      setAuthToken(response.data.token);
      localStorage.setItem('teacherName', response.data.teacher.name);
      localStorage.setItem('login', values.login);
      localStorage.setItem('lessonName', values.lessonName);
      localStorage.setItem('lessonNumber', values.lessonNumber);
      localStorage.setItem('lessonGroup', group);

      setIsLogined(true);
      setIsCorrectLessonInfo(true);
      resetForm();
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error('Teacher login failed:', error);
        return;
      }
    }
  };

  const handleLessonSubmit = async (values, { resetForm }) => {
    console.log(values);

    if (
      values.lessonName === localStorage.getItem('lessonName') &&
      values.lessonNumber === localStorage.getItem('lessonNumber') &&
      group === localStorage.getItem('lessonGroup')
    ) {
      setIsCorrectLessonInfo(true);
      resetForm();
      return;
    }

    try {
      const response = await axios.post('/pedagogium-lessons', {
        page: group,
        teacherName: localStorage.getItem('teacherName'),
        lessonName: values.lessonName,
        lessonNumber: values.lessonNumber,
      });

      localStorage.setItem('lessonId', response.data.lessonId);
      localStorage.setItem('lessonName', values.lessonName);
      localStorage.setItem('lessonNumber', values.lessonNumber);
      localStorage.setItem('lessonGroup', group);
      resetForm();
    } catch (e) {
      console.error(e);
    }
    setIsCorrectLessonInfo(true);
  };

  const closeInputs = () => {
    setIsQuizInputOpen(false);
    setIsQuizOptionsOpen(false);
    setIsQuizTrueFalseOpen(false);
    setIsQuizFeedbackOpen(false);
  };

  const changeQuestionID = () => {
    questionID.current = nanoid(5);
  };

  useEffect(() => {
    document.title = `Teacher ${group.toLocaleUpperCase()} | AP Education`;

    const refreshToken = async () => {
      console.log('token refresher');
      const login = localStorage.getItem('login');
      try {
        if (login) {
          const res = await axios.post('pedagogium-teachers/refresh', {
            login,
          });
          setAuthToken(res.data.newToken);
          setIsLogined(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    refreshToken();

    const checkGroup = async () => {
      const [course, groupNumber] = group.split('_');
      const courses = await axios.get('/pedagogium-courses/admin');

      setIsGroupExist(
        courses.data.some(
          group =>
            group.slug === course && group.courseGroups.includes(+groupNumber)
        )
      );
    };

    checkGroup();
  }, [group]);

  // const toggleViewer = () => {
  //   !isOpenedLast
  //     ? setIsViewerOpen(isViewerOpen => !isViewerOpen)
  //     : isOpenedLast === 'viewer' &&
  //       setIsViewerOpen(isViewerOpen => !isViewerOpen);
  //   isWhiteBoardOpen ||
  //   isPlatformOpen ||
  //   isKahootOpen ||
  //   isQuizInputOpen ||
  //   isQuizOptionsOpen ||
  //   isQuizTrueFalseOpen ||
  //   isQuizFeedbackOpen
  //     ? setIsOpenedLast(isOpenedLast => 'viewer')
  //     : setIsOpenedLast(isOpenedLast => '');
  // };
  // const toggleWhiteBoard = () => {
  //   !isOpenedLast
  //     ? setIsWhiteBoardOpen(isWhiteBoardOpen => !isWhiteBoardOpen)
  //     : isOpenedLast === 'whiteboard' &&
  //       setIsWhiteBoardOpen(isWhiteBoardOpen => !isWhiteBoardOpen);
  //   isViewerOpen ||
  //   isPlatformOpen ||
  //   isKahootOpen ||
  //   isQuizInputOpen ||
  //   isQuizOptionsOpen ||
  //   isQuizTrueFalseOpen ||
  //   isQuizFeedbackOpen
  //     ? setIsOpenedLast(isOpenedLast => 'whiteboard')
  //     : setIsOpenedLast(isOpenedLast => '');
  // };
  // const togglePlatform = () => {
  //   !isOpenedLast
  //     ? setIsPlatformOpen(isPlatformOpen => !isPlatformOpen)
  //     : isOpenedLast === 'platform' &&
  //       setIsPlatformOpen(isPlatformOpen => !isPlatformOpen);
  //   isViewerOpen ||
  //   isWhiteBoardOpen ||
  //   isKahootOpen ||
  //   isQuizInputOpen ||
  //   isQuizOptionsOpen ||
  //   isQuizTrueFalseOpen ||
  //   isQuizFeedbackOpen
  //     ? setIsOpenedLast(isOpenedLast => 'platform')
  //     : setIsOpenedLast(isOpenedLast => '');
  // };
  const toggleKahoot = () => {
    !isOpenedLast
      ? setIsKahootOpen(isKahootOpen => !isKahootOpen)
      : isOpenedLast === 'kahoot' &&
        setIsKahootOpen(isKahootOpen => !isKahootOpen);
    isPlatformOpen ||
    isWhiteBoardOpen ||
    isViewerOpen ||
    isQuizInputOpen ||
    isQuizOptionsOpen ||
    isQuizTrueFalseOpen ||
    isQuizFeedbackOpen
      ? setIsOpenedLast(isOpenedLast => 'kahoot')
      : setIsOpenedLast(isOpenedLast => '');

    setIsKahootsWasOpened(true);
  };
  // eslint-disable-next-line
  const toggleQuizInput = () => {
    !isOpenedLast
      ? setIsQuizInputOpen(isQuizInputOpen => !isQuizInputOpen)
      : isOpenedLast === 'input' &&
        setIsQuizInputOpen(isQuizInputOpen => !isQuizInputOpen);
    isPlatformOpen || isWhiteBoardOpen || isViewerOpen || isKahootOpen
      ? setIsOpenedLast(isOpenedLast => 'input')
      : setIsOpenedLast(isOpenedLast => '');
    setIsQuizOptionsOpen(false);
    setIsQuizTrueFalseOpen(false);
    setIsQuizFeedbackOpen(false);
  };
  const toggleQuizOptions = () => {
    !isOpenedLast
      ? setIsQuizOptionsOpen(isQuizOptionsOpen => !isQuizOptionsOpen)
      : isOpenedLast === 'input' &&
        setIsQuizOptionsOpen(isQuizOptionsOpen => !isQuizOptionsOpen);
    isPlatformOpen || isWhiteBoardOpen || isViewerOpen || isKahootOpen
      ? setIsOpenedLast(isOpenedLast => 'input')
      : setIsOpenedLast(isOpenedLast => '');
    setIsQuizInputOpen(false);
    setIsQuizTrueFalseOpen(false);
    setIsQuizFeedbackOpen(false);
  };
  const toggleQuizTrueFalse = () => {
    !isOpenedLast
      ? setIsQuizTrueFalseOpen(isQuizTrueFalseOpen => !isQuizTrueFalseOpen)
      : isOpenedLast === 'input' &&
        setIsQuizTrueFalseOpen(isQuizTrueFalseOpen => !isQuizTrueFalseOpen);
    isPlatformOpen || isWhiteBoardOpen || isViewerOpen || isKahootOpen
      ? setIsOpenedLast(isOpenedLast => 'input')
      : setIsOpenedLast(isOpenedLast => '');
    setIsQuizInputOpen(false);
    setIsQuizOptionsOpen(false);
    setIsQuizFeedbackOpen(false);
  };
  const toggleQuizFeedback = () => {
    !isOpenedLast
      ? setIsQuizFeedbackOpen(isQuizFeedbackOpen => !isQuizFeedbackOpen)
      : isOpenedLast === 'input' &&
        setIsQuizFeedbackOpen(isQuizFeedbackOpen => !isQuizFeedbackOpen);
    isPlatformOpen || isWhiteBoardOpen || isViewerOpen || isKahootOpen
      ? setIsOpenedLast(isOpenedLast => 'input')
      : setIsOpenedLast(isOpenedLast => '');
    setIsQuizInputOpen(false);
    setIsQuizOptionsOpen(false);
    setIsQuizTrueFalseOpen(false);
  };

  const toggleQROPen = () => {
    setIsQROpen(isQROpen => !isQROpen);
  };

  const toggleButtonBox = () => {
    setIsButtonBoxOpen(isOpen => !isOpen);
  };
  // eslint-disable-next-line
  const toggleInputButtonBox = () => {
    setIsInputButtonBoxOpen(isInputButtonBoxOpen => !isInputButtonBoxOpen);
  };

  return (
    <>
      {isGroupExist ? (
        <>
          {isCorrectLessonInfo ? (
            <>
              <LessonInfoBox>
                {localStorage.getItem('teacherName')} <br />
                {localStorage.getItem('lessonName')}{' '}
                {localStorage.getItem('lessonNumber')}
              </LessonInfoBox>
              <TeacherButtonBox className={!isButtonBoxOpen ? 'hidden' : ''}>
                {/* <ViewerBtn onClick={toggleViewer}>
          <ViewerLogo />
        </ViewerBtn> */}
                {/* <WhiteBoardBtn onClick={toggleWhiteBoard}>
          <WhiteBoardLogo />
        </WhiteBoardBtn> */}
                {/* <PlatformBtn onClick={togglePlatform}>
          <PlatformLogo />
        </PlatformBtn> */}
                <KahootBtn onClick={toggleKahoot}>
                  <KahootLogo />
                </KahootBtn>
                <InputBtn onClick={toggleInputButtonBox}>QUIZ</InputBtn>
                <InputButtonBox
                  className={isInputButtonBoxOpen ? '' : 'hidden'}
                >
                  <InputBtn onClick={toggleQuizInput}>TEXT</InputBtn>

                  <InputBtn onClick={toggleQuizOptions}>A-B-C</InputBtn>

                  <InputBtn onClick={toggleQuizTrueFalse}>TRUE FALSE</InputBtn>

                  <InputBtn onClick={toggleQROPen}>QR</InputBtn>

                  {/* TODO: delete conditional randering ↓ */}
                  {['a0', 'a0_2', 'a1', 'a2'].includes(group) && (
                    <InputBtn onClick={toggleQuizFeedback}>FEED BACK</InputBtn>
                  )}
                </InputButtonBox>
              </TeacherButtonBox>
              <TeacherButtonBoxHideSwitch
                id="no-transform"
                onClick={toggleButtonBox}
              >
                {isButtonBoxOpen ? (
                  <BoxHideRightSwitch />
                ) : (
                  <BoxHideLeftSwitch />
                )}
              </TeacherButtonBoxHideSwitch>

              {/* <Viewer
        page={group}
        sectionWidth={width}
        isViewerOpen={isViewerOpen}
        isOpenedLast={isOpenedLast}
      /> */}

              <Platform
                page={group}
                sectionWidth={width}
                isPlatformOpen={true}
                isOpenedLast={isOpenedLast}
              />
              {isKahootsWasOpened && (
                <HostKahoots
                  page={group}
                  sectionWidth={width}
                  sectionHeight={height}
                  isKahootOpen={isKahootOpen}
                  isOpenedLast={isOpenedLast}
                />
              )}
              <TeacherChat page={group} />
              <TeacherQuizInput
                page={group}
                isQuizInputOpen={isQuizInputOpen}
                isQuizOptionsOpen={isQuizOptionsOpen}
                isQuizTrueFalseOpen={isQuizTrueFalseOpen}
                isQuizFeedbackOpen={isQuizFeedbackOpen}
                closeInputs={closeInputs}
                isOpenedLast={isOpenedLast}
                questionID={questionID.current}
                changeQuestionID={changeQuestionID}
              />
              <TeacherQuizOptions
                page={group}
                isQuizInputOpen={isQuizInputOpen}
                isQuizOptionsOpen={isQuizOptionsOpen}
                isQuizTrueFalseOpen={isQuizTrueFalseOpen}
                isQuizFeedbackOpen={isQuizFeedbackOpen}
                closeInputs={closeInputs}
                isOpenedLast={isOpenedLast}
                questionID={questionID.current}
                changeQuestionID={changeQuestionID}
              />
              <TeacherQuizTrueFalse
                page={group}
                isQuizInputOpen={isQuizInputOpen}
                isQuizOptionsOpen={isQuizOptionsOpen}
                isQuizTrueFalseOpen={isQuizTrueFalseOpen}
                isQuizFeedbackOpen={isQuizFeedbackOpen}
                closeInputs={closeInputs}
                isOpenedLast={isOpenedLast}
                questionID={questionID.current}
                changeQuestionID={changeQuestionID}
              />
              <TeacherQuizFeedback
                page={group}
                isQuizInputOpen={isQuizInputOpen}
                isQuizOptionsOpen={isQuizOptionsOpen}
                isQuizTrueFalseOpen={isQuizTrueFalseOpen}
                isQuizFeedbackOpen={isQuizFeedbackOpen}
                closeInputs={closeInputs}
                isOpenedLast={isOpenedLast}
                questionID={questionID.current}
                changeQuestionID={changeQuestionID}
                teacherName={localStorage.getItem('teacherName')}
              />
              <QRCodeModal onClose={toggleQROPen} isOpen={isQROpen} />
            </>
          ) : (
            <>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  {isLogined ? (
                    <Formik
                      initialValues={initialLessonValue}
                      onSubmit={handleLessonSubmit}
                      validationSchema={lessonSchema}
                    >
                      <LoginForm>
                        <LoginLogo />
                        <Label>
                          <AdminInput
                            type="text"
                            name="lessonName"
                            placeholder="Nazwa lekcji"
                          />
                          <AdminInputNote component="p" name="lessonName" />
                        </Label>
                        <Label>
                          <AdminInput
                            type="text"
                            name="lessonNumber"
                            placeholder="Numer lekcji"
                          />
                          <AdminInputNote component="p" name="lessonNumber" />
                        </Label>
                        <AdminFormBtn type="submit">
                          <FormBtnText>rozpocząć lekcję</FormBtnText>
                        </AdminFormBtn>
                      </LoginForm>
                    </Formik>
                  ) : (
                    <Formik
                      initialValues={initialLoginValue}
                      onSubmit={handleLoginSubmit}
                      validationSchema={loginSchema}
                    >
                      <LoginForm>
                        <LoginLogo />
                        <Label>
                          <AdminInput
                            type="text"
                            name="login"
                            placeholder="Login"
                          />
                          <AdminInputNote component="p" name="login" />
                        </Label>
                        <Label>
                          <AdminInput
                            type="password"
                            name="password"
                            placeholder="Hasło"
                          />
                          <AdminInputNote component="p" name="password" />
                        </Label>
                        <Label>
                          <AdminInput
                            type="text"
                            name="lessonName"
                            placeholder="Nazwa lekcji"
                          />
                          <AdminInputNote component="p" name="lessonName" />
                        </Label>
                        <Label>
                          <AdminInput
                            type="text"
                            name="lessonNumber"
                            placeholder="Numer lekcji"
                          />
                          <AdminInputNote component="p" name="lessonNumber" />
                        </Label>
                        <AdminFormBtn type="submit">
                          <FormBtnText>rozpocząć lekcję</FormBtnText>
                        </AdminFormBtn>
                      </LoginForm>
                    </Formik>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default TeacherPage;
