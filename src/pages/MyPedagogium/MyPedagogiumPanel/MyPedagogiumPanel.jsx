import { useEffect, useState } from 'react';
import { Timetable } from '../Timetable/Timetable';
import {
  AdminBtnIcon,
  APPanel,
  APPanelBtn,
  InfoBtnIcon,
  PanelBackdrop,
  PanelHideLeftSwitch,
  PanelHideRightSwitch,
  PanelHideSwitch,
  TimetableBtnIcon,
} from './MyPedagogiumPanel.styled';
import { Info } from '../Info/Info';

export const MyPedagogiumPanel = ({
  user,
  language,
  timetable,
  isMultipleCourses,
}) => {
  const [isBackdropShown, setIsBackdropShown] = useState(false);
  const [isTimetableShown, setIsTimetableShown] = useState(false);
  const [isInfoShown, setIsInfoShown] = useState(false);
  const [isButtonBoxShown, setIsButtonBoxShown] = useState(true);

  const toggleButtonBox = () => {
    hideBackdrop();
    setIsButtonBoxShown(isShown => !isShown);
  };

  const hideBackdrop = () => {
    setIsBackdropShown(false);
    setIsTimetableShown(false);
    setIsInfoShown(false);
  };

  const toggleTimetable = () => {
    !isBackdropShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = true));
    isBackdropShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = false));

    setIsTimetableShown(isTimetableShown => !isTimetableShown);
  };

  const toggleInfo = () => {
    !isBackdropShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = true));
    isBackdropShown &&
      setIsBackdropShown(isBackdropShown => (isBackdropShown = false));

    setIsInfoShown(isInfoShown => !isInfoShown);
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
            <APPanelBtn onClick={toggleInfo}>
              <InfoBtnIcon className={isInfoShown && 'active'} id="info-btn" />
            </APPanelBtn>
            <APPanelBtn onClick={toggleTimetable}>
              <TimetableBtnIcon
                className={isTimetableShown && 'active'}
                id="timetable-btn"
              />
            </APPanelBtn>
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
    </>
  );
};
