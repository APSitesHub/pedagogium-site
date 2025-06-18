import { Formik } from 'formik';
import {
  LabelDatePickerText,
  SpeakingFormBtn,
  SpeakingLabel,
  StudentTextAreaNote,
  StyledDatePicker,
  UserSpeakingEditForm,
} from '../TeacherPageSpeakingEditForm/TeacherPageSpeakingEditForm.styled';
import { EditFormHeader, StudentTextArea } from '../TeacherPage.styled';
import * as yup from 'yup';
import { useState } from 'react';
import axios from 'axios';

import 'react-datepicker/dist/react-datepicker.css';
import { Label } from 'components/LeadForm/LeadForm.styled';

export const UserFeedbackEditForm = ({
  userToEdit,
  updateFeedback,
  closeEditForm,
}) => {
  const [startDate, setStartDate] = useState(undefined);
  const [isDateWrong, setIsDateWrong] = useState(false);

  const initialEditStudentValues = {
    feedback: '',
  };

  const studentSchema = yup.object().shape({
    feedback: yup.string().required('Feedback required'),
  });

  const normalizeDate = date => {
    return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}.${
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    }.${date.getFullYear()}`;
  };

  const handleEditStudentSubmit = async values => {
    if (!startDate) {
      setIsDateWrong(true);
      return;
    }

    const date = normalizeDate(startDate);
    const feedback = `Feedback from: ${date}:

${values.feedback}`;

    try {
      const response = await axios.patch(
        `pedagogium-users/feedback/${userToEdit._id}`,
        {
          date: date,
          feedback: feedback,
        }
      );

      closeEditForm();
      updateFeedback(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Formik
      initialValues={initialEditStudentValues}
      onSubmit={handleEditStudentSubmit}
      validationSchema={studentSchema}
    >
      <UserSpeakingEditForm>
        <EditFormHeader id="focus">{userToEdit.name}</EditFormHeader>
        <SpeakingLabel>
          <LabelDatePickerText>Wybierz termin zajęć</LabelDatePickerText>
        </SpeakingLabel>
        <StyledDatePicker
          className={isDateWrong ? 'error' : undefined}
          selected={startDate}
          dateFormat="dd.MM.yyyy"
          onChange={date => {
            setStartDate(date);
            date && setIsDateWrong(false);
          }}
          calendarStartDay={1}
          shouldCloseOnSelect={true}
          maxDate={new Date()}
        />
        <Label>
          <StudentTextArea
            type="text"
            name="feedback"
            component="textarea"
            placeholder="Feedback"
          />
          <StudentTextAreaNote component="p" name="feedback" />
        </Label>
        <SpeakingFormBtn type="submit">Potwierdź zmiany</SpeakingFormBtn>
      </UserSpeakingEditForm>
    </Formik>
  );
};
