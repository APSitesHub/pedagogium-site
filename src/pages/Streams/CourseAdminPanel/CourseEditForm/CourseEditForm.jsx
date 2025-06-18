import axios from 'axios';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import { Loader } from 'components/SharedLayout/Loaders/Loader';
import { Formik } from 'formik';
import { AdminFormBtn } from 'pages/Streams/AdminPanel/AdminPanel.styled';
import { useState } from 'react';
import { slugify, transliterate } from 'transliteration';
import * as yup from 'yup';
import { UsersEditForm } from '../../UserAdminPanel/UserAdminPanel.styled';
import {
  AdminInput,
  AdminInputHint,
  AdminInputNote,
} from '../CourseAdminPanel.styled';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

export const CourseEditForm = ({
  translations,
  lang,
  courseToEdit,
  closeEditForm,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialEditCourseValues = {
    courseName: courseToEdit.courseName,
    courseGroups: String(
      courseToEdit.courseGroups[courseToEdit.courseGroups.length - 1]
    ),
    university: 'Pedagogium (Wyższa Szkoła Nauk Społecznych)',
  };

  const courseEditSchema = yup.object().shape({
    courseName: yup.string().required(translations[lang]?.courseNameRequired),
    courseGroups: yup
      .string()
      .required(translations[lang]?.courseGroupsRequired),
    university: yup.string(),
  });

  const handleCourseEditSubmit = async (values, { resetForm }) => {
    values.courseGroups = [...Array(Math.ceil(values.courseGroups)).keys()].map(
      i => i + 1
    );
    values.slug = slugify(transliterate(values.courseName));

    setIsLoading(isLoading => (isLoading = true));
    try {
      const response = await axios.put(
        `/pedagogium-courses/${courseToEdit._id}`,
        values
      );
      console.log(response);
      closeEditForm();
      alert(translations[lang]?.courseEdited);
    } catch (error) {
      console.error(error);
      alert(translations[lang]?.addCourseError);
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  return (
    <>
      <Formik
        initialValues={initialEditCourseValues}
        onSubmit={handleCourseEditSubmit}
        validationSchema={courseEditSchema}
      >
        <UsersEditForm>
          <Label>
            <AdminInputHint>
              {translations[lang]?.courseNameLabel}
            </AdminInputHint>
            <AdminInput
              type="text"
              name="courseName"
              placeholder={`${translations[lang]?.courseName}`}
            />
            <AdminInputNote component="p" name="courseName" />
          </Label>
          <Label>
            <AdminInputHint>
              {translations[lang]?.courseGroupsLabel}
            </AdminInputHint>
            <AdminInput
              type="text"
              name="courseGroups"
              placeholder={`${translations[lang]?.courseGroups}`}
            />
            <AdminInputNote component="p" name="courseGroups" />
          </Label>
          <AdminFormBtn type="submit">
            <FormBtnText>{translations[lang]?.editCourseButton}</FormBtnText>
          </AdminFormBtn>
        </UsersEditForm>
      </Formik>
      {isLoading && <Loader />}
    </>
  );
};
