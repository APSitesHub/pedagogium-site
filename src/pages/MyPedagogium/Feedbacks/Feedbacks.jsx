import { useEffect, useState } from 'react';
import { AttendanceBox } from '../Attendance/Attendance.styled';
import {
  FeedbackButton,
  FeedbackButtonsBox,
  NextFeedbackButton,
  PreviousFeedbackButton,
} from 'pages/TeacherPage/StudentChart/StudentChart.styled';
import {
  FeedbackHeader,
  UserFeedbackText,
} from 'pages/TeacherPage/TeacherPage.styled';

export const Feedbacks = ({ feedbacks }) => {
  const [sortedFeedbacks, setSortedFeedbacks] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  const getPreviousFeedback = () => {
    setCurrentFeedback(prev => prev + 1);
  };

  const getNextFeedback = () => {
    setCurrentFeedback(prev => prev - 1);
  };

  useEffect(() => {
    if (!feedbacks || feedbacks.length === 0) return;

    const parseDate = str => {
      const [day, month, year] = str.split('.').map(Number);
      return new Date(year, month - 1, day);
    };

    const sorted = [...feedbacks].sort((a, b) => {
      return parseDate(b.date) - parseDate(a.date);
    });

    setSortedFeedbacks(sorted);
    setCurrentFeedback(0);
  }, [feedbacks]);

  return (
    <AttendanceBox>
      <div
        style={{
          padding: '12px',
        }}
      >
        <FeedbackButtonsBox style={{ marginBottom: '16px' }}>
          <FeedbackButton
            onClick={getPreviousFeedback}
            disabled={
              currentFeedback === sortedFeedbacks.length - 1 ||
              !sortedFeedbacks.length
            }
            className="prev"
          >
            <PreviousFeedbackButton />
          </FeedbackButton>
          <FeedbackButton
            onClick={getNextFeedback}
            disabled={currentFeedback === 0 || !sortedFeedbacks.length}
            className="next"
          >
            <NextFeedbackButton />
          </FeedbackButton>
        </FeedbackButtonsBox>
        {sortedFeedbacks.length && currentFeedback !== null ? (
          <>
            <FeedbackHeader>
              Feedback from {sortedFeedbacks[currentFeedback].date}:
            </FeedbackHeader>
            <br />
            <UserFeedbackText>
              {sortedFeedbacks[currentFeedback].feedback}
            </UserFeedbackText>
          </>
        ) : (
          <p>Nie ma jeszcze żadnych recenzji</p>
        )}
      </div>
    </AttendanceBox>
  );
};
