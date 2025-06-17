import axios from 'axios';
import { nanoid } from 'nanoid';
import { useLayoutEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';

import {
  ClipBoardAdd,
  ClipBoardBtn,
  ClipBoardCopy,
  ClipBoardFormDismissBtn,
  ClipBoardFormText,
  ClipBoardInput,
  ClipBoardInputForm,
  ClipBoardNotification,
  ClipBoardSubmitBtn,
  DismissIcon,
  KahootBackground,
  KahootBox,
  KahootExitFullScreenIcon,
  KahootFullScreenBtn,
  KahootFullScreenIcon,
  KahootNameValidation,
  KahootNumbersBtn,
  KahootNumbersHider,
  KahootPicker,
  KahootPickerBtn,
  NameReverse,
  NameReverseBtn,
} from './Kahoots.styled';

export const Kahoots = ({
  sectionWidth,
  sectionHeight,
  isKahootOpen,
  isChatOpen,
  isOpenedLast,
  room,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isAnimated, setIsAnimated] = useState(true);
  const [username, setUsername] = useState(
    localStorage.getItem('userName') || ''
  );
  const [kahoots, setKahoots] = useState({});
  const [activeKahoot, setActiveKahoot] = useState(1);

  const { ref, inView } = useInView({
    triggerOnce: true,
    delay: 1000,
  });

  const kahootWidth = isFullScreen ? sectionWidth : (sectionWidth / 10) * 4;

  const kahootLinksRefresher = async e => {
    if (e.target === e.currentTarget) {
      setKahoots((await axios.get(`/pedagogium-kahoots/${room}`)).data.links);
    }
  };

  const setKahootNumber = async e => {
    const kahootNumber = parseInt(e.currentTarget.innerText);
    setKahoots((await axios.get(`/pedagogium-kahoots/${room}`)).data.links);
    setActiveKahoot(kahootNumber);
  };

  useLayoutEffect(() => {
    const getLinksRequest = async () => {
      try {
        setKahoots((await axios.get(`/pedagogium-kahoots/${room}`)).data.links);
      } catch (error) {
        console.log(error);
      }
    };

    getLinksRequest();
  }, [room]);

  const toggleFullScreen = () => {
    setIsFullScreen(isFullScreen => (isFullScreen = !isFullScreen));
  };

  const toggleKahootPicker = () => {
    setIsAnimated(false);
    setIsPickerOpen(isOpen => (isOpen = !isOpen));
    setActiveKahoot(1);
  };

  const disableEnter = e => (e.key === 'Enter' ? e.preventDefault() : null);

  const createNameInput = btn => {
    btn.disabled = true;
    document.addEventListener('keydown', disableEnter);
    toast(
      t => (
        <ClipBoardInputForm
          onSubmit={async e => {
            e.preventDefault();
            const userName = localStorage.getItem('userName');
            if (!userName) {
              createValidationEmptyInput();
              return;
            } else if (userName.trim().trimStart().split(' ').length < 2) {
              createValidationNotEnoughWords();
              return;
            } else {
              toast.dismiss(t.id);
              document.removeEventListener('keydown', disableEnter);
              setUsername(
                username => (username = localStorage.getItem('userName'))
              );
              btn.disabled = false;
              if (localStorage.getItem('userName')) {
                copyToClipboard(btn);
              }
              localStorage.setItem('userID', nanoid(8));
            }
          }}
        >
          <ClipBoardFormDismissBtn
            onClick={e => {
              e.preventDefault();
              toast.dismiss(t.id);
              btn.disabled = false;
              document.removeEventListener('keydown', disableEnter);
            }}
          >
            <DismissIcon />
          </ClipBoardFormDismissBtn>
          <ClipBoardFormText>
            Enter your full first and last name in this field so you don't have
            to enter it multiple times during the lesson.
          </ClipBoardFormText>
          <ClipBoardFormText>
            Please provide your full first and last name without abbreviations
            so we can properly assign your points!
          </ClipBoardFormText>
          <ClipBoardInput
            name="username"
            placeholder="Imię"
            defaultValue={localStorage.getItem('userName')}
            onChange={e => {
              if (e.target.value) {
                localStorage.setItem('userName', e.target.value);
              }
            }}
          />
          <ClipBoardSubmitBtn>Save</ClipBoardSubmitBtn>
        </ClipBoardInputForm>
      ),
      { duration: Infinity }
    );
  };

  const createValidationEmptyInput = () => {
    toast.error(
      t => (
        <>
          <ClipBoardFormDismissBtn onClick={() => toast.dismiss(t.id)}>
            <DismissIcon />
          </ClipBoardFormDismissBtn>
          <KahootNameValidation>
            First and last name are required!
          </KahootNameValidation>
        </>
      ),
      { duration: 1500 }
    );
  };

  const createValidationNotEnoughWords = () => {
    toast.error(
      t => (
        <>
          <ClipBoardFormDismissBtn onClick={() => toast.dismiss(t.id)}>
            <DismissIcon />
          </ClipBoardFormDismissBtn>
          <KahootNameValidation>
            First and last name, please — 2 words!
          </KahootNameValidation>
        </>
      ),
      { duration: 1500 }
    );
  };

  const copyToClipboard = btn => {
    navigator.clipboard.writeText(localStorage.getItem('userName'));
    toast.success(
      t => (
        <ClipBoardNotification>
          <ClipBoardFormText>
            <ClipBoardFormDismissBtn onClick={() => toast.dismiss(t.id)}>
              <DismissIcon />
            </ClipBoardFormDismissBtn>
            {`${localStorage.getItem('userName')}`}, your name has been added to
            the clipboard, you can paste it into the appropriate field!
          </ClipBoardFormText>

          <ClipBoardFormText>
            Need to fix a mistake? Click this button:
          </ClipBoardFormText>
          <ClipBoardSubmitBtn
            onClick={() => {
              toast.dismiss(t.id);
              createNameInput(btn);
            }}
          >
            Fix the mistake
          </ClipBoardSubmitBtn>
        </ClipBoardNotification>
      ),
      { duration: 3000 }
    );
  };

  const reverseAndCopyToClipboard = btn => {
    toast.dismiss();
    navigator.clipboard.writeText(localStorage.getItem('userName'));
    toast.success(
      t => (
        <ClipBoardNotification>
          <ClipBoardFormText>
            <ClipBoardFormDismissBtn onClick={() => toast.dismiss(t.id)}>
              <DismissIcon />
            </ClipBoardFormDismissBtn>
            {`${localStorage.getItem('userName')}`}, your first and last name
            have been added to the clipboard in reverse order, you can paste
            them into the appropriate field and try joining Kahoot again!
          </ClipBoardFormText>

          <ClipBoardFormText>
            Need to fix a mistake? Click this button:
          </ClipBoardFormText>

          <ClipBoardSubmitBtn
            onClick={() => {
              toast.dismiss(t.id);
              createNameInput(btn);
            }}
          >
            Fix the mistake
          </ClipBoardSubmitBtn>
        </ClipBoardNotification>
      ),
      { duration: 3000 }
    );
  };

  const handleUsernameBtn = e => {
    const btn = e.currentTarget;
    username ? copyToClipboard(btn) : createNameInput(btn);
  };

  const handleUsernameReverseBtn = e => {
    const reverseUsername = username
      .trim()
      .trimStart()
      .split(' ')
      .reverse()
      .join(' ');
    localStorage.setItem('userName', reverseUsername);
    setUsername(username => (username = reverseUsername));
    reverseAndCopyToClipboard(e.currentTarget);
  };

  return (
    <>
      {kahoots.length && (
        <KahootBox
          ref={ref}
          className={isKahootOpen ? 'shown' : 'hidden'}
          style={{
            zIndex: isOpenedLast === 'kahoot' ? '3' : '1',
            width: isChatOpen && isFullScreen ? kahootWidth - 300 : kahootWidth,
            height: sectionHeight,
          }}
          onTransitionEnd={kahootLinksRefresher}
        >
          <KahootNumbersHider
            onClick={toggleKahootPicker}
            className={inView && isAnimated ? 'animated' : ''}
            tabIndex={-1}
          >
            <KahootPickerBtn />
          </KahootNumbersHider>
          <KahootPicker className={isPickerOpen ? 'shown' : 'hidden'}>
            {kahoots.map((link, i) => (
              <KahootNumbersBtn
                key={i}
                onClick={setKahootNumber}
                className={activeKahoot === i + 1 ? 'active' : ''}
                tabIndex={-1}
              >
                {i + 1}
              </KahootNumbersBtn>
            ))}
          </KahootPicker>
          {username && (
            <NameReverseBtn
              tabIndex={-1}
              onClick={e => handleUsernameReverseBtn(e)}
            >
              <NameReverse />
            </NameReverseBtn>
          )}
          {kahoots.map(
            (link, i) =>
              activeKahoot === i + 1 && (
                <KahootBackground key={i}>
                  <iframe
                    id="kahoot-window"
                    title="kahoot-pin"
                    src={link}
                    width={
                      !isChatOpen
                        ? kahootWidth
                        : isFullScreen
                        ? kahootWidth - 300
                        : kahootWidth
                    }
                    height={sectionHeight}
                  ></iframe>
                  <KahootFullScreenBtn onClick={toggleFullScreen}>
                    {isFullScreen ? (
                      <KahootExitFullScreenIcon />
                    ) : (
                      <KahootFullScreenIcon />
                    )}
                  </KahootFullScreenBtn>
                  <ClipBoardBtn onClick={handleUsernameBtn}>
                    {username ? <ClipBoardCopy /> : <ClipBoardAdd />}
                  </ClipBoardBtn>
                </KahootBackground>
              )
          )}
        </KahootBox>
      )}
    </>
  );
};
