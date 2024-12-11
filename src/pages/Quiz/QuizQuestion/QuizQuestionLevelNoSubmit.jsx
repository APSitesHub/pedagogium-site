import { useLocation } from 'react-router-dom';
import beginner from '../../../img/quiz/beginner.png';
import middle from '../../../img/quiz/middle.png';
import present from '../../../img/quiz/present.png';
import senior from '../../../img/quiz/senior.png';
import zero from '../../../img/quiz/zero.png';
import {
  BackgroundFilterBottomLeft,
  BackgroundFilterTopRight,
  BackgroungStarSmall,
  CurrentPage,
  DescriptionHighlight,
  DescriptionLevel,
  Emoji,
  Logo,
  NextPageBtn,
  PageCounter,
  Pagination,
  PresentEmoji,
  PreviousPageBtn,
  QuestionLevel,
  QuizArrowLeft,
  QuizArrowRight,
  QuizBox,
  QuizButton,
  QuizButtonBox,
  QuizButtonContent,
} from '../Quiz.styled';

export const QuizQuestionLevelNoSubmit = ({
  activeSlide,
  isChild,
  continueQuiz,
  previousQuestion,
  nextQuestion,
  quizValues,
  lang,
}) => {
  const location = useLocation().pathname;

  const getTag = location => {
    switch (location) {
      case '/quiz-code':
        return 'quiz-code';
      case '/quiz-code/':
        return 'quiz-code';
      default:
        break;
    }
  };

  const tag = getTag(location);

  const mailRandomId = Math.floor(Math.random() * 1000000).toString();
  const passwordRandom = Math.floor(Math.random() * 1000000).toString();
  const authCodeRandom = Math.floor(Math.random() * 1000000).toString();

  quizValues.current.tag = tag;
  quizValues.current.mail =
    mailRandomId.length < 6
      ? `marathon-ap0${mailRandomId}@ap.edu`
      : `marathon-ap${mailRandomId}@ap.edu`;
  quizValues.current.password =
    passwordRandom.length < 6 ? '0' + passwordRandom : passwordRandom;
  quizValues.current.authCode =
    authCodeRandom.length < 6 ? '0' + authCodeRandom : authCodeRandom;

  const setQuizValue = (e, value) => {
    quizValues.current.knowledge = value;
    continueQuiz(e);
  };

  return (
    <>
      <QuizBox>
        <Logo />
        <QuestionLevel>
          {isChild ? 'Вкажіть рівень дитини' : 'Вкажіть ваш рівень'}
        </QuestionLevel>
        <DescriptionLevel>
          Оберіть рівень та отримайте гарантовані{' '}
          <DescriptionHighlight>подарунки</DescriptionHighlight> в кінці
          опитування
          <PresentEmoji src={present} alt="Present emoji" width="30" />
        </DescriptionLevel>

        <QuizButtonBox>
          <QuizButton
            onClick={async e => {
              setQuizValue(e, 'a0');
            }}
            className={quizValues.current?.knowledge === 'a0' && 'chosen'}
          >
            <QuizButtonContent>
              <Emoji src={zero} alt="Running man emoji" width="21" />
              Нульовий
            </QuizButtonContent>
          </QuizButton>
          <QuizButton
            onClick={async e => {
              setQuizValue(e, 'a1');
            }}
            className={quizValues.current?.knowledge === 'a1' && 'chosen'}
          >
            <QuizButtonContent>
              <Emoji src={beginner} alt="Face in glasses emoji" width="21" />
              Початковий
            </QuizButtonContent>
          </QuizButton>
          <QuizButton
            onClick={async e => {
              setQuizValue(e, 'a2');
            }}
            className={quizValues.current?.knowledge === 'a2' && 'chosen'}
          >
            <QuizButtonContent>
              <Emoji src={middle} alt="Alumni hat emoji" width="21" />
              Середній
            </QuizButtonContent>
          </QuizButton>
          {quizValues.current.lang === 'en' && quizValues.current.adult && (
            <QuizButton
              onClick={async e => {
                setQuizValue(e, 'b1');
              }}
              className={quizValues.current?.knowledge === 'b1' && 'chosen'}
            >
              <QuizButtonContent>
                <Emoji src={senior} alt="Prize cup emoji" width="21" />
                Високий
              </QuizButtonContent>
            </QuizButton>
          )}
        </QuizButtonBox>
        <BackgroundFilterTopRight />
        <BackgroundFilterBottomLeft />
        <BackgroungStarSmall />
        <Pagination>
          <PreviousPageBtn
            className={activeSlide - 1 < 1 && 'disabled'}
            disabled={activeSlide - 1 < 1 && true}
            onClick={previousQuestion}
          >
            <QuizArrowLeft />
          </PreviousPageBtn>
          <PageCounter>
            <CurrentPage>{activeSlide}</CurrentPage>/{lang ? 7 : 8}
          </PageCounter>
          <NextPageBtn
            className={
              activeSlide + 1 > 1 &&
              !quizValues.current?.knowledge &&
              'disabled'
            }
            disabled={
              activeSlide + 1 > 1 && !quizValues.current?.knowledge && true
            }
            onClick={nextQuestion}
          >
            <QuizArrowRight />
          </NextPageBtn>
        </Pagination>
      </QuizBox>
    </>
  );
};
