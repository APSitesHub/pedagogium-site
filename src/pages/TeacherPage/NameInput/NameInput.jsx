import { NameInputBox, TeacherInfoInput } from './NameInput.styled';

export const NameInput = ({ isNameInputOpen, changeTeacherInfo }) => {
  const setValuesAndUpdateTeacherInfo = () => {
    const name = document.querySelector('input[name="nameValue"]').value;
    const lesson = document.querySelector('input[name="lessonValue"]').value;
    const course = document.querySelector(
      'input[name="courseGroupValue"]'
    ).value;
    changeTeacherInfo(name, lesson, course);
    document.querySelector('input[name="nameValue"]').value = '';
    document.querySelector('input[name="lessonValue"]').value = '';
    document.querySelector('input[name="courseGroupValue"]').value = '';
  };

  return (
    <NameInputBox className={isNameInputOpen ? 'shown' : 'hidden'}>
      <TeacherInfoInput
        type="text"
        name="nameValue"
        placeholder="Imię wykładowcy"
      ></TeacherInfoInput>
      <TeacherInfoInput
        type="text"
        name="courseGroupValue"
        placeholder="Kurs i numer grupy"
      ></TeacherInfoInput>
      <TeacherInfoInput
        type="text"
        name="lessonValue"
        placeholder="Numer lekcji"
      ></TeacherInfoInput>
      <button onClick={setValuesAndUpdateTeacherInfo}>OK</button>
    </NameInputBox>
  );
};
