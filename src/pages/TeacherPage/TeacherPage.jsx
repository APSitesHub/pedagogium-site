import useSize from '@react-hook/size';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HostKahoots } from './HostKahoots/HostKahoots';
import { NameInput } from './NameInput/NameInput';
import { LessonInfoBox, NameInputBtn } from './NameInput/NameInput.styled';
import { Platform } from './Platform/Platform';
import { TeacherChat } from './TeacherChat/TeacherChat';
import {
  BoxHideDownSwitch,
  BoxHideLeftSwitch,
  BoxHideRightSwitch,
  BoxHideUpSwitch,
  InputButtonBox,
  // PlatformBtn,
  // PlatformLogo,
  TeacherButtonBox,
  TeacherButtonBoxHideSwitch,
  // ViewerBtn,
  // ViewerLogo,
  // WhiteBoardBtn,
  // WhiteBoardLogo,
  InputBtn,
  KahootBtn,
  KahootLogo,
} from './TeacherPage.styled';
import { TeacherQuizInput } from './TeacherQuiz/TeacherQuizInput';
import { TeacherQuizOptions } from './TeacherQuiz/TeacherQuizOptions';
import { TeacherQuizTrueFalse } from './TeacherQuiz/TeacherQuizTrueFalse';
// import { Viewer } from './Viewer/Viewer';
// import { WhiteBoard } from './WhiteBoard/WhiteBoard';
import { TeacherQuizFeedback } from './TeacherQuiz/TeacherQuizFeedback';
import { QRCodeModal } from './TeacherQuiz/TeacherQR';
import axios from 'axios';
import NotFound from 'pages/NotFound/NotFound';

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
  const [isNameInputOpen, setIsNameInputOpen] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({});
  const questionID = useRef(nanoid(5));

  console.log('group:', group);

  const closeInputs = () => {
    setIsQuizInputOpen(false);
    setIsQuizOptionsOpen(false);
    setIsQuizTrueFalseOpen(false);
    setIsQuizFeedbackOpen(false);
  };

  const changeQuestionID = () => {
    questionID.current = nanoid(5);
  };

  const changeTeacherInfo = (nameValue, lessonValue, levelValue) => {
    setTeacherInfo(
      teacherInfo =>
        (teacherInfo = {
          ...{ name: nameValue, lesson: lessonValue, level: levelValue },
        })
    );
    setIsNameInputOpen(isOpen => (isOpen = false));
  };

  useEffect(() => {
    document.title = `Teacher ${group.toLocaleUpperCase()} | AP Education`;

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

  const toggleNameInput = () => {
    setIsNameInputOpen(isNameInputOpen => !isNameInputOpen);
  };

  return (
    <>
      {isGroupExist ? (
        <>
          <NameInputBtn onClick={toggleNameInput}>
            {isNameInputOpen ? <BoxHideUpSwitch /> : <BoxHideDownSwitch />}
          </NameInputBtn>
          <LessonInfoBox
            className={
              !teacherInfo.name + teacherInfo.level + teacherInfo.lesson
                ? ''
                : 'no-info'
            }
          >
            {teacherInfo.name} <br />
            {teacherInfo.level} {teacherInfo.lesson}
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
            <InputButtonBox className={isInputButtonBoxOpen ? '' : 'hidden'}>
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
            {isButtonBoxOpen ? <BoxHideRightSwitch /> : <BoxHideLeftSwitch />}
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
          <HostKahoots
            page={group}
            sectionWidth={width}
            sectionHeight={height}
            isKahootOpen={isKahootOpen}
            isOpenedLast={isOpenedLast}
          />
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
            teacherName={teacherInfo.name}
          />
          <QRCodeModal onClose={toggleQROPen} isOpen={isQROpen} />
          <NameInput
            isNameInputOpen={isNameInputOpen}
            changeTeacherInfo={changeTeacherInfo}
          />
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default TeacherPage;
