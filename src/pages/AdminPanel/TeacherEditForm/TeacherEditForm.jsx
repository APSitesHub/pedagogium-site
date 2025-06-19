import axios from 'axios';
import { Label } from 'components/LeadForm/LeadForm.styled';
import { Loader } from 'components/SharedLayout/Loaders/Loader';
import { Formik } from 'formik';
import { SubmitFormBtn } from 'pages/Streams/CourseAdminPanel/CourseAdminPanel.styled';
import { EditFormHeader } from 'pages/TeacherPage/TeacherPage.styled';
import { useState } from 'react';
import * as yup from 'yup';
import {
  AdminInputNote,
  FormField,
  UsersEditForm,
} from '../TeacherAdminPanel.styled';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

export const TeacherEditForm = ({ teacherToEdit, closeEditForm }) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log(teacherToEdit);

  const initialTeacherValues = {
    name: teacherToEdit.name,
    login: teacherToEdit.login,
    password: teacherToEdit.password,
    platformId: teacherToEdit.platformId,
  };

  const teachersSchema = yup.object().shape({
    name: yup.string().required('Imię i nazwisko - pole obowiązkowe'),
    login: yup.string().required('Login - pole obowiązkowe!'),
    password: yup.string().required('Hasło - pole obowiązkowe!'),
  });

  const handleTeacherSubmit = async (values, { resetForm }) => {
    setIsLoading(isLoading => (isLoading = true));
    values.name = values.name.trim().trimStart();
    values.login = values.login.toLowerCase().trim().trimStart();
    values.password = values.password.trim().trimStart();
    values.platformId = values.platformId.trim().trimStart();
    try {
      const response = await axios.put(
        `/pedagogium-teachers/${teacherToEdit._id}`,
        values
      );
      console.log(response);
      resetForm();
      alert('Nauczyciel edytował');
      closeEditForm();
    } catch (error) {
      console.error(error);
      alert(
        'Wystąpił jakiś problem - naciśnij F12, zrób zrzut ekranu konsoli i wyślij do Kyryła'
      );
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  return (
    <>
      <Formik
        initialValues={initialTeacherValues}
        onSubmit={handleTeacherSubmit}
        validationSchema={teachersSchema}
      >
        <UsersEditForm>
          <EditFormHeader>{teacherToEdit.name}</EditFormHeader>
          <Label>
            <FormField type="text" name="name" placeholder="Nazwisko i imię" />
            <AdminInputNote component="p" name="name" />
          </Label>
          <Label>
            <FormField type="text" name="login" placeholder="Login" />
            <AdminInputNote component="p" name="login" />
          </Label>
          <Label>
            <FormField type="text" name="password" placeholder="Hasło" />
            <AdminInputNote component="p" name="password" />
          </Label>
          <Label>
            <FormField
              type="text"
              name="platformId"
              placeholder="ID platformy"
            />
            <AdminInputNote component="p" name="platformId" />
          </Label>
          <SubmitFormBtn type="submit">Potwierdź zmiany</SubmitFormBtn>
        </UsersEditForm>
      </Formik>
      {isLoading && <Loader />}
    </>
  );
};
