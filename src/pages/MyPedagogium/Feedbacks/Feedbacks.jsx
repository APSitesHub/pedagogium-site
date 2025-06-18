import { useEffect, useState } from 'react';
import { AttendanceBox } from '../Attendance/Attendance.styled';
import {
  FeedbackButton,
  FeedbackButtonsBox,
  NextFeedbackButton,
  PreviousFeedbackButton,
} from 'pages/TeacherPage/StudentChart/StudentChart.styled';

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
  }, []);

  return (
    <AttendanceBox>
      <div
        style={{
          padding: '12px',
        }}
      >
        <FeedbackButtonsBox style={{ marginBottom: '8px' }}>
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
          <p style={{ whiteSpace: 'pre-wrap', maxWidth: '380px' }}>
            {sortedFeedbacks[currentFeedback].feedback}
          </p>
        ) : (
          <p>Nie ma jeszcze żadnych recenzji</p>
        )}
      </div>
    </AttendanceBox>
  );
};
