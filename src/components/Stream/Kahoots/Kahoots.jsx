import axios from 'axios';
import { nanoid } from 'nanoid';
import { useLayoutEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';

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
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isAnimated, setIsAnimated] = useState(true);
  const [username, setUsername] = useState(
    localStorage.getItem('userName') || ''
  );
  const [kahoots, setKahoots] = useState({});
  const [activeKahoot, setActiveKahoot] = useState(1);

  let location = useLocation();

  const { ref, inView } = useInView({
    triggerOnce: true,
    delay: 1000,
  });

  const trialsSwitch = path => {
    switch (path) {
      case 'a1free':
        return 'a1kidsfree';
      case 'pilot':
        return 'deutsch';
      case 'b1beginner':
        return 'b1kidsbeginner';
      case 'b2beginner':
        return 'b2kidsbeginner';
      case 'trendets':
        return 'trendets';
      case 'pilot-a1':
        return 'a1';
      case 'test1':
        return 'test';
      case 'trial-en':
        return 'trials';
      case 'trial-de':
        return 'trials_de';
      case 'trial-pl':
        return 'trials_pl';
      case 'trial-kids':
        return 'trials_kids';
      default:
        break;
    }
  };

  let page =
    location.pathname.includes('pilot') ||
    location.pathname.includes('beginner') ||
    location.pathname.includes('trendets') ||
    (location.pathname.includes('streams-kids') &&
      location.pathname.includes('free'))
      ? trialsSwitch(location.pathname.match(/\/([^/]+)\/?$/)[1])
      : location.pathname.includes('preschool')
      ? location.pathname.match(/\/([^/]+)\/?$/)[1]
      : location.pathname.includes('pre') ||
        location.pathname.includes('beg') ||
        location.pathname.includes('mid') ||
        location.pathname.includes('high')
      ? 'kids' + location.pathname.match(/\/([^/]+)\/?$/)[1]
      : location.pathname.includes('streams-kids')
      ? location.pathname.match(/\/([^/]+)\/?$/)[1] + 'kids'
      : location.pathname.includes('trial') ||
        location.pathname.includes('pilot') ||
        location.pathname.includes('test1')
      ? trialsSwitch(location.pathname.match(/\/([^/]+)\/?$/)[1])
      : location.pathname.match(/\/([^/]+)\/?$/)[1];

  page = 'pedagogium_' + page;

  console.log(111, page);

  const kahootWidth = isFullScreen ? sectionWidth : (sectionWidth / 10) * 4;

  const getLinksForLocation = () => {
    const entries = [];
    Object.values(kahoots[page].links).map(entry => {
      entries.push(entry);
      return entries;
    });
    return entries;
  };

  const kahootLinksRefresher = async e => {
    if (e.target === e.currentTarget) {
      setKahoots((await axios.get('/unikahoots')).data);
    }
  };

  const setKahootNumber = async e => {
    const kahootNumber = parseInt(e.currentTarget.innerText);
    setKahoots((await axios.get('/unikahoots')).data);
    setActiveKahoot(kahootNumber);
  };

  useLayoutEffect(() => {
    const getLinksRequest = async () => {
      try {
        setKahoots((await axios.get('/unikahoots')).data);
      } catch (error) {
        console.log(error);
      }
    };

    getLinksRequest();
  }, []);

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
            Wpisz swoje imię i nazwisko w to pole, aby nie musieć wpisywać go
            kilka razy podczas lekcji.
          </ClipBoardFormText>
          <ClipBoardFormText>
            Proszę podać pełne imię i nazwisko bez skrótów, abyśmy mogli
            prawidłowo zaliczyć Twoje punkty!
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
          <ClipBoardSubmitBtn>Zapisz</ClipBoardSubmitBtn>
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
            Imię i nazwisko są wymagane!
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
            Imię i nazwisko, proszę, 2 słowa!
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
            {`${localStorage.getItem('userName')}`}, twoje imię zostało dodane
            do schowka, możesz je wkleić w odpowiednie pole!
          </ClipBoardFormText>

          <ClipBoardFormText>
            Popełniłeś błąd? Kliknij ten przycisk:{' '}
          </ClipBoardFormText>
          <ClipBoardSubmitBtn
            onClick={() => {
              toast.dismiss(t.id);
              createNameInput(btn);
            }}
          >
            Popraw błąd
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
            {`${localStorage.getItem('userName')}`}, twoje imię i nazwisko
            zostały dodane do schowka w odwrotnej kolejności, możesz je wkleić w
            odpowiednie pole i spróbować ponownie dołączyć do Kahoota!
          </ClipBoardFormText>

          <ClipBoardFormText>
            Musisz poprawić błąd? Kliknij ten przycisk:{' '}
          </ClipBoardFormText>

          <ClipBoardSubmitBtn
            onClick={() => {
              toast.dismiss(t.id);
              createNameInput(btn);
            }}
          >
            Popraw błąd
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
      {Object.keys(kahoots).length && (
        <KahootBox
          ref={ref}
          className={isKahootOpen ? 'shown' : 'hidden'}
          style={{
            zIndex: isOpenedLast === 'kahoot' ? '3' : '1',
            width: isChatOpen ? kahootWidth - 300 : kahootWidth,
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
            {Object.values(kahoots[page].links).map((link, i) => (
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
          {getLinksForLocation().map(
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
