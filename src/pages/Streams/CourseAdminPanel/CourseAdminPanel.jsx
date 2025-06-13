import axios from 'axios';
import { Backdrop } from 'components/LeadForm/Backdrop/Backdrop.styled';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import { Loader } from 'components/SharedLayout/Loaders/Loader';
import { LoginLogo } from 'components/Stream/Stream.styled';
import { Formik } from 'formik';
import { LoginErrorNote } from 'pages/MyPedagogium/MyPedagogiumPanel/MyPedagogiumPanel.styled';
import {
  AdminFormBtn,
  LoginForm,
} from 'pages/Streams/AdminPanel/AdminPanel.styled';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  AdminPanelSection,
  UserCell,
  UserDBCaption,
  UserDBRow,
  UserDBTable,
  UserDeleteButton,
  UserEditButton,
  UserHeadCell,
  UsersForm,
} from '../UserAdminPanel/UserAdminPanel.styled';
import {
  AdminInput,
  AdminInputHint,
  AdminInputNote,
} from './CourseAdminPanel.styled';
import { CourseEditForm } from './CourseEditForm/CourseEditForm';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

const setAuthToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const Universities = {
  PEDAGOGIUM: 'Pedagogium',
};

const translations = {
  pl: {
    loginPlaceholder: 'Login',
    passwordPlaceholder: 'Password',
    loginRequired: 'Podaj login!',
    passwordRequired: 'Podaj hasło!',
    loginButton: 'Zaloguj się',
    addCourseButton: 'Dodaj kurs',
    editCourseButton: 'Edytuj kurs',
    courseListCaption: 'Kursy dostępne dla studentów',
    courseName: 'Nazwa kursu',
    courseNameLabel: 'Proszę wprowadzić pełną nazwę kursu bez skrótów',
    courseGroups: 'Maksymalna liczba grup na kursie',
    courseGroupsLabel: 'Podaj liczbę grup – lista wygeneruje się automatycznie',
    courseGroupsTableHead: 'Lista dostępnych grup kursu',
    edit: 'Edytuj',
    delete: 'Usuń',
    deleteCourseConfirmation: 'Czy na pewno usunąć?',
    courseEdited: 'Kurs pomyślnie edytowany',
    courseDeleted: 'Kurs pomyślnie usunięty',
    deleteCourseError:
      'Wystąpił nieoczekiwany błąd serwera. Proszę odświeżyć stronę i spróbować ponownie. W przypadku dalszych problemów prosimy o kontakt z pomocą techniczną.',
    addCourseError:
      'Wystąpił nieoczekiwany błąd serwera. Proszę odświeżyć stronę i spróbować ponownie. W przypadku dalszych problemów prosimy o kontakt z pomocą techniczną.',
    courseAdded: 'Kurs pomyślnie dodany',
    courseNameRequired: 'Nazwa kursu - obowiązkowe pole!',
    courseGroupsRequired: 'Grupa - obowiązkowe pole!',
  },
  ua: {
    loginPlaceholder: 'Логін',
    passwordPlaceholder: 'Пароль',
    loginRequired: 'Введіть логін!',
    passwordRequired: 'Введіть пароль!',
    loginButton: 'Залогінитись',
    addCourseButton: 'Додати курс',
    editCourseButton: 'Відредагувати курс',
    courseListCaption: 'Список юзерів з доступом до уроків',
    courseName: 'Назва курсу',
    courseNameLabel: 'Внесіть повну назву курсу без скорочень',
    courseGroups: 'Дозволена кількість груп на курсі',
    courseGroupsLabel:
      'Введіть кількість груп – список буде згенеровано автоматично',
    courseGroupsTableHead: 'Список доступних груп курсу',
    deleteCourseConfirmation: 'Точно видалити?',
    courseEdited: 'Курс успішно відредаговано',
    courseDeleted: 'Курс успішно видалено',
    deleteCourseError:
      'Помилка! Імовірно, сталася непередбачена помилка на сервері - спробуйте оновити сторінку та спробувати знову або зверніться до техпідтримки!',
    addCourseError:
      'Помилка! Імовірно, сталася непередбачена помилка на сервері - спробуйте оновити сторінку та спробувати знову або зверніться до техпідтримки!',
    courseAdded: 'Курс успішно додано',
    courseNameRequired: "Назва курсу - обов'язкове поле!",
    courseGroupsRequired: "Дозволені групи - обов'язкове поле!",
  },
};

const CourseAdminPanel = ({ uni, lang = 'ua' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseToEdit, setCourseToEdit] = useState({});
  const [isUserInfoIncorrect, setIsUserInfoIncorrect] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    document.title = uni
      ? `${Universities[uni]} | Panel administracyjny kursów`
      : 'Courses Admin Panel';

    const refreshToken = async () => {
      console.log('token refresher');
      try {
        if (localStorage.getItem('isAdmin')) {
          const res = await axios.post('admins/refresh/pedagogium/', {});
          setAuthToken(res.data.newToken);
          setIsUserAdmin(isAdmin => (isAdmin = true));
        }
      } catch (error) {
        console.log(error);
      }
    };
    refreshToken();

    const getCourses = async () => {
      try {
        if (isUserAdmin) {
          const response = await axios.get('/pedagogium-courses/admin/');

          setCourses(
            courses =>
              (courses = [
                ...response.data.sort((a, b) =>
                  a.courseName.localeCompare(b.courseName)
                ),
              ])
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCourses();
  }, [isUserAdmin, isEditFormOpen, isLoading, uni]);

  const initialLoginValues = {
    login: '',
    password: '',
  };

  const loginSchema = yup.object().shape({
    login: yup.string().required(translations[lang]?.loginRequired),
    password: yup.string().required(translations[lang]?.passwordRequired),
  });

  const handleLoginSubmit = async (values, { resetForm }) => {
    setIsLoading(isLoading => (isLoading = true));
    try {
      const response = await axios.post('/admins/login/pedagogium', values);
      setAuthToken(response.data.token);
      setIsUserAdmin(isAdmin => (isAdmin = true));
      localStorage.setItem('isAdmin', true);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  const initialCourseValues = {
    courseName: '',
    courseGroups: '',
    university: 'Pedagogium (Wyższa Szkoła Nauk Społecznych)',
  };

  const courseSchema = yup.object().shape({
    courseName: yup.string().required(translations[lang]?.courseNameRequired),
    courseGroups: yup
      .string()
      .required(translations[lang]?.courseGroupsRequired),
    university: yup.string(),
  });

  const handleCourseSubmit = async (values, { resetForm }) => {
    values.courseGroups = [...Array(Math.ceil(values.courseGroups)).keys()].map(
      i => i + 1
    );

    setIsLoading(isLoading => (isLoading = true));
    try {
      const response = await axios.post('/pedagogium-courses/', values);
      setAuthToken(response.data.token);
      setIsUserAdmin(isAdmin => (isAdmin = true));
      localStorage.setItem('isAdmin', true);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  const handleEdit = async id => {
    setIsEditFormOpen(true);
    setCourseToEdit(
      courseToEdit => (courseToEdit = courses.find(course => course._id === id))
    );
  };

  const handleDelete = async id => {
    setIsLoading(isLoading => (isLoading = true));

    try {
      const response = await axios.delete(`/pedagogium-courses/${id}`);
      console.log(response);
      alert(translations[lang]?.courseDeleted);
    } catch (error) {
      console.error(error);
      alert(translations[lang]?.deleteCourseError);
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  const closeEditForm = e => {
    setIsEditFormOpen(false);
  };

  const closeEditFormOnClick = e => {
    if (e.target.id === 'close-on-click') {
      setIsEditFormOpen(false);
    }
  };

  return (
    <>
      <AdminPanelSection>
        {!isUserAdmin && (
          <Formik
            initialValues={initialLoginValues}
            onSubmit={handleLoginSubmit}
            validationSchema={loginSchema}
          >
            <LoginForm>
              <LoginLogo />
              <Label>
                <AdminInput
                  type="text"
                  name="login"
                  placeholder={translations[lang]?.loginPlaceholder}
                  onBlur={() => setIsUserInfoIncorrect(false)}
                />
                <AdminInputNote component="p" name="login" />
              </Label>
              <Label>
                <AdminInput
                  type="password"
                  name="password"
                  placeholder={translations[lang]?.passwordPlaceholder}
                  onBlur={() => setIsUserInfoIncorrect(false)}
                />
                <AdminInputNote component="p" name="password" />
              </Label>
              <AdminFormBtn type="submit">
                <FormBtnText>{translations[lang]?.loginButton}</FormBtnText>
              </AdminFormBtn>
              <LoginErrorNote
                style={
                  isUserInfoIncorrect ? { opacity: '1' } : { opacity: '0' }
                }
              >
                Password or email is incorrect!
              </LoginErrorNote>
            </LoginForm>
          </Formik>
        )}

        {isUserAdmin && courses && (
          <>
            <Formik
              initialValues={initialCourseValues}
              onSubmit={handleCourseSubmit}
              validationSchema={courseSchema}
            >
              <UsersForm>
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
                  <FormBtnText>
                    {translations[lang]?.addCourseButton}
                  </FormBtnText>
                </AdminFormBtn>
              </UsersForm>
            </Formik>
            <UserDBTable>
              <UserDBCaption>
                {translations[lang]?.courseListCaption}
              </UserDBCaption>
              <thead>
                <UserDBRow>
                  <UserHeadCell>№</UserHeadCell>
                  <UserHeadCell>{translations[lang]?.courseName}</UserHeadCell>
                  <UserHeadCell>
                    {translations[lang]?.courseGroups}
                  </UserHeadCell>
                  <UserHeadCell>{translations[lang]?.edit}</UserHeadCell>
                  <UserHeadCell>{translations[lang]?.delete}</UserHeadCell>
                </UserDBRow>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <UserDBRow key={course._id}>
                    <UserCell>{index + 1}</UserCell>
                    <UserCell>{course.courseName}</UserCell>
                    <UserCell>{course.courseGroups.join(', ')}</UserCell>
                    <UserCell>
                      <UserEditButton onClick={() => handleEdit(course._id)}>
                        {translations[lang]?.edit}
                      </UserEditButton>
                    </UserCell>
                    <UserCell>
                      <UserDeleteButton
                        onClick={() => handleDelete(course._id)}
                      >
                        {translations[lang]?.delete}
                      </UserDeleteButton>
                    </UserCell>
                  </UserDBRow>
                ))}
              </tbody>
            </UserDBTable>
          </>
        )}
        {isEditFormOpen && (
          <Backdrop onMouseDown={closeEditFormOnClick} id="close-on-click">
            <CourseEditForm
              translations={translations}
              lang={lang}
              courseToEdit={courseToEdit}
              closeEditForm={closeEditForm}
            />
          </Backdrop>
        )}
        {isLoading && <Loader />}
      </AdminPanelSection>
    </>
  );
};

export default CourseAdminPanel;
