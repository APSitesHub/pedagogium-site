import { useEffect, useState } from 'react';
import { Timetable } from '../Timetable.jsx/Timetable';
import {
  APPanel,
  APPanelBtn,
  CalendarBtnIcon,
  CupBtnIcon,
  PanelBackdrop,
  PanelHideLeftSwitch,
  PanelHideRightSwitch,
  PanelHideSwitch,
  TimetableBtnIcon,
} from './MyPedagogiumPanel.styled';
import { Points } from '../Points/Points';

export const MyPedagogiumPanel = ({ user, timetable }) => {
  const [isBackdropShown, setIsBackdropShown] = useState(false);
  const [isRatingShown, setIsRatingShown] = useState(false);
  const [isCalendarShown, setIsCalendarShown] = useState(false);
  const [isTimetableShown, setIsTimetableShown] = useState(false);
  const [isButtonBoxShown, setIsButtonBoxShown] = useState(true);

  const toggleButtonBox = () => {
    hideBackdrop();
    setIsButtonBoxShown(isShown => !isShown);
  };

  const hideBackdrop = () => {
    setIsBackdropShown(false);
    setIsTimetableShown(false);
    setIsRatingShown(false);
    setIsCalendarShown(false);
  };

  const toggleTooltip = e => {
    // !isDisclaimerTimeoutActive &&
    e.currentTarget.classList.toggle('tooltip-open');
  };

  const toggleTimetable = () => {
    !isBackdropShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = true));
    isBackdropShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = false));

    setIsTimetableShown(isTimetableShown => !isTimetableShown);
  };

  const toggleRating = () => {
    !isBackdropShown &&
      (!isCalendarShown || !isTimetableShown) &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = true));
    isBackdropShown &&
      !isCalendarShown &&
      !isTimetableShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = false));
    setIsCalendarShown(false);
    setIsTimetableShown(false);
    setIsRatingShown(isRatingShown => !isRatingShown);
  };

  const toggleCalendar = () => {
    !isBackdropShown &&
      (!isRatingShown || !isTimetableShown) &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = true));
    isBackdropShown &&
      !isRatingShown &&
      !isTimetableShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = false));
    setIsRatingShown(false);
    setIsTimetableShown(false);
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

      <PanelHideSwitch id="no-transform" onClick={toggleButtonBox}>
        {isButtonBoxShown ? <PanelHideRightSwitch /> : <PanelHideLeftSwitch />}
      </PanelHideSwitch>
      <APPanel className={isButtonBoxShown ? '' : 'hidden'}>
        {user.package !== 'online' && (
          <>
            <APPanelBtn onClick={toggleTimetable}>
              <TimetableBtnIcon
                className={isTimetableShown && 'active'}
                id="timetable-btn"
              />
            </APPanelBtn>
            <APPanelBtn
              onClick={toggleRating}
              onMouseEnter={e => toggleTooltip(e)}
              onMouseOut={e => toggleTooltip(e)}
            >
              <CupBtnIcon
                id="rating-btn"
                className={isRatingShown && 'active'}
              />
            </APPanelBtn>
            <APPanelBtn
              onClick={toggleCalendar}
              onMouseEnter={e => toggleTooltip(e)}
              onMouseOut={e => toggleTooltip(e)}
            >
              <CalendarBtnIcon
                id="calendar-btn"
                className={isCalendarShown && 'active'}
              />
            </APPanelBtn>
          </>
        )}
      </APPanel>
      {isRatingShown && (
        <Points
          user={user}
          flatPoints={[
            { name: 'Dev Acc', points: 1, course: 1 },
            { name: 'test2', points: 2, course: 1 },
          ]}
        />
      )}
      {isTimetableShown && <Timetable user={user} timetable={timetable} />}
    </>
  );
};
