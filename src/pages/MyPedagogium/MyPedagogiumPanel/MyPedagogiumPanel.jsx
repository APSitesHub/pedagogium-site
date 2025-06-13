import { useEffect, useState } from 'react';
import { Timetable } from '../Timetable/Timetable';
import {
  AdminBtnIcon,
  APPanel,
  APPanelBtn,
  CalendarBtnIcon,
  InfoBtnIcon,
  LogoutBtn,
  LogoutBtnIcon,
  LogoutPanel,
  PanelBackdrop,
  PanelHideLeftSwitch,
  PanelHideRightSwitch,
  PanelHideSwitch,
  TimetableBtnIcon,
} from './MyPedagogiumPanel.styled';
import { Info } from '../Info/Info';
import { Attendance } from '../Attendance/Attendance';

export const MyPedagogiumPanel = ({
  user,
  language,
  timetable,
  handleLogout,
}) => {
  const [isBackdropShown, setIsBackdropShown] = useState(false);
  const [isTimetableShown, setIsTimetableShown] = useState(false);
  const [isCalendarShown, setIsCalendarShown] = useState(false);
  const [isInfoShown, setIsInfoShown] = useState(false);
  const [isButtonBoxShown, setIsButtonBoxShown] = useState(true);

  const toggleButtonBox = () => {
    hideBackdrop();
    setIsButtonBoxShown(isShown => !isShown);
  };

  const hideBackdrop = () => {
    setIsBackdropShown(false);
    setIsTimetableShown(false);
    setIsCalendarShown(false);
    setIsInfoShown(false);
  };

  const toggleTimetable = () => {
    !isBackdropShown &&
      (!isCalendarShown || !isInfoShown) &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = true));
    isBackdropShown &&
      !isCalendarShown &&
      !isInfoShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = false));
    setIsCalendarShown(false);
    setIsInfoShown(false);
    setIsTimetableShown(isTimetableShown => !isTimetableShown);
  };

  const toggleInfo = () => {
    !isBackdropShown &&
      (!isCalendarShown || !isTimetableShown) &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = true));
    isBackdropShown &&
      !isCalendarShown &&
      !isTimetableShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = false));
    setIsTimetableShown(false);
    setIsCalendarShown(false);
    setIsInfoShown(isInfoShown => !isInfoShown);
  };

  const toggleCalendar = () => {
    !isBackdropShown &&
      (!isInfoShown || !isTimetableShown) &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = true));
    isBackdropShown &&
      !isInfoShown &&
      !isTimetableShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = false));
    setIsTimetableShown(false);
    setIsInfoShown(false);
    setIsCalendarShown(isCalendarShown => !isCalendarShown);
  };

  useEffect(() => {
    const onEscapeClose = event => {
      if (event.code === 'Escape' && isBackdropShown) {
        hideBackdrop();
      }
    };

    window.addEventListener('keydown', onEscapeClose);

    return () => {
      window.removeEventListener('keydown', onEscapeClose);
    };
  });

  return (
    <>
      <PanelBackdrop
        onClick={hideBackdrop}
        className={isBackdropShown ? '' : 'hidden'}
      />
      <LogoutPanel>
        <LogoutBtn onClick={handleLogout}>
          <LogoutBtnIcon />
          Log Out
        </LogoutBtn>
      </LogoutPanel>

      <PanelHideSwitch id="no-transform" onClick={toggleButtonBox}>
        {isButtonBoxShown ? <PanelHideRightSwitch /> : <PanelHideLeftSwitch />}
      </PanelHideSwitch>
      <APPanel className={isButtonBoxShown ? '' : 'hidden'}>
        {user.package !== 'online' && (
          <>
            <APPanelBtn onClick={toggleInfo}>
              <InfoBtnIcon className={isInfoShown && 'active'} id="info-btn" />
            </APPanelBtn>
            <APPanelBtn onClick={toggleTimetable}>
              <TimetableBtnIcon
                className={isTimetableShown && 'active'}
                id="timetable-btn"
              />
            </APPanelBtn>
            {user.package !== 'online' && (
              <APPanelBtn onClick={toggleCalendar}>
                <CalendarBtnIcon
                  id="calendar-btn"
                  className={isCalendarShown && 'active'}
                />
              </APPanelBtn>
            )}
            {(user.mail === 'dev@mail.com' ||
              user.mail === 'teacher2535@pedagogium.pl') && (
              <APPanelBtn
                onClick={() =>
                  window.open(
                    'https://academy.ap.education/streams/pedagogium-admin-panel'
                  )
                }
              >
                <AdminBtnIcon id="admin-btn" />
              </APPanelBtn>
            )}
          </>
        )}
      </APPanel>
      {isTimetableShown && <Timetable user={user} timetable={timetable} />}
      {isInfoShown && <Info />}
      {isCalendarShown && (
        <Attendance user={user} personalLessonsDays={[1, 2, 3, 4, 5]} />
      )}
    </>
  );
};
