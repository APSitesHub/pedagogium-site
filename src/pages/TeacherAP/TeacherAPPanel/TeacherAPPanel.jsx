import { useState } from 'react';
import {
  APPanel,
  PanelBackdrop,
  PanelHideLeftSwitch,
  PanelHideRightSwitch,
  PanelHideSwitch,
} from '../../MyPedagogium/MyPedagogiumPanel/MyPedagogiumPanel.styled';

const TeacherAPPanel = () => {
  const [isBackdropShown, setIsBackdropShown] = useState(false);
  const [isButtonBoxShown, setIsButtonBoxShown] = useState(false);

  const toggleButtonBox = () => {
    hideBackdrop();
    setIsButtonBoxShown(isShown => !isShown);
  };

  const hideBackdrop = () => {
    setIsBackdropShown(false);
  };

  return (
    <>
      <PanelBackdrop className={isBackdropShown ? '' : 'hidden'} />

      <PanelHideSwitch id="no-transform" onClick={toggleButtonBox}>
        {isButtonBoxShown ? <PanelHideRightSwitch /> : <PanelHideLeftSwitch />}
      </PanelHideSwitch>

      <APPanel
        className={isButtonBoxShown ? '' : 'hidden'}
        style={{ top: '230px' }}
      >

      </APPanel>
    </>
  );
};

export default TeacherAPPanel;
