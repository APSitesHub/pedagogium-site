import { useState } from 'react';
import {
  StudentQuizBox,
  StudentQuizBoxInput,
  StudentQuizBoxInputNote,
  StudentQuizForm,
  StudentQuizSubmitBtn,
} from './StudentInput.styled';
import axios from 'axios';

export const StudentInput = ({
  isInputOpen,
  socket,
  page,
  toggleQuiz,
  currentUser,
  user,
  questionID,
}) => {
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = async e => {
    if (!document.querySelector('#answer_input').value) {
      setIsValid(false);
      return;
    }

    const answer = document
      .querySelector('#answer_input')
      .value.trim()
      .trimEnd()
      .toLowerCase();
    e.preventDefault();

    document.querySelector('#answer_input').value = '';
    toggleQuiz();

    socket.emit('answer:given', {
      answer: answer,
      page: page,
    });

    console.log(43, 'answer:given', {
      answer: answer,
      username: user?.name || currentUser.username,
      page: page,
      socketID: socket.id,
      questionID: questionID,
      userID: user?.id || currentUser.userID,
    });

    await axios.post('/answers', {
      answer: answer,
      username: user?.name || currentUser.username,
      page: page,
      socketID: socket.id,
      questionID: questionID,
      userID: user?.id || currentUser.userID,
    });
  };

  return (
    <StudentQuizBox
      className={isInputOpen ? 'shown' : 'hidden'}
      //   draggable={true}
      //   onDrag={handleOnDrag}
      //   onTouchMove={handleOnDrag}
    >
      <StudentQuizForm>
        <StudentQuizBoxInput
          type="text"
          id="answer_input"
          placeholder="Write your answer"
          required
          onChange={e => {
            return e.target.value && setIsValid(true);
          }}
        />
        <StudentQuizSubmitBtn onClick={e => handleSubmit(e)}>Send</StudentQuizSubmitBtn>
        {!isValid && (
          <StudentQuizBoxInputNote>Answer is required</StudentQuizBoxInputNote>
        )}
      </StudentQuizForm>
    </StudentQuizBox>
  );
};
