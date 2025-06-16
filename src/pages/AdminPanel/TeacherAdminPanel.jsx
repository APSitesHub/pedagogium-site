import axios from 'axios';
import { Backdrop } from 'components/LeadForm/Backdrop/Backdrop.styled';
import { Label } from 'components/LeadForm/LeadForm.styled';
import { Loader } from 'components/SharedLayout/Loaders/Loader';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  AdminFormBtn,
  AdminInput,
  AdminInputNote,
  AdminPanelSection,
  LoginForm,
  UserCell,
  UserDBCaption,
  UserDBRow,
  UserDBTable,
  UserDeleteButton,
  UserEditButton,
  UserHeadCell,
  UsersForm,
} from './TeacherAdminPanel.styled';
import { TeacherEditForm } from './TeacherEditForm/TeacherEditForm';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';
// axios.defaults.baseURL = 'http://localhost:3001';
const setAuthToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const TeacherAdminPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState({});
  const [isTimeToUpdate, setIsTimeToUpdate] = useState(false);

  useEffect(() => {
    document.title = 'Teacher Admin Panel | Pedagogium';

    const refreshToken = async () => {
      console.log('token refresher');
      try {
        if (localStorage.getItem('isAdmin')) {
          const res = await axios.post('admins/refresh/teachers/', {});
          setAuthToken(res.data.newToken);
          console.log(res);
          setIsUserAdmin(isAdmin => (isAdmin = true));
        }
      } catch (error) {
        console.log(error);
      }
    };
    refreshToken();

    const getTeachers = async () => {
      try {
        if (isUserAdmin) {
          const response = await axios.get('/pedagogium-teachers');
          setTeachers(teachers => (teachers = [...response.data.reverse()]));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getTeachers();

    const onEscapeClose = event => {
      if (event.code === 'Escape' && isEditFormOpen) {
        closeEditForm();
      }
    };

    window.addEventListener('keydown', onEscapeClose);

    return () => {
      window.removeEventListener('keydown', onEscapeClose);
    };
  }, [isUserAdmin, isEditFormOpen, isTimeToUpdate]);

  const initialLoginValues = {
    login: '',
    password: '',
  };

  const loginSchema = yup.object().shape({
    login: yup.string().required('Podaj login!'),
    password: yup.string().required('Wprowadź hasło!'),
  });

  const changeDateFormat = dateString => {
    if (dateString) {
      const dateArray = dateString.split('.');
      return dateArray.length > 2
        ? Date.parse([dateArray[1], dateArray[0], dateArray[2]].join('/'))
        : Date.parse(dateString);
    }
    return;
  };

  const handleLoginSubmit = async (values, { resetForm }) => {
    setIsLoading(isLoading => (isLoading = true));
    try {
      const response = await axios.post('/admins/login/teachers', values);
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

  const initialTeacherValues = {
    name: '',
    login: '',
    password: '',
  };

  const teachersSchema = yup.object().shape({
    name: yup.string().required('Imię i nazwisko - pole obowiązkowe'),
    login: yup.string().required('Login - pole obowiązkowe!'),
    password: yup.string().required('Hasło - pole obowiązkowe!'),
  });

  const handleTeacherSubmit = async (values, { resetForm }) => {
    values.name = values.name.trim().trimStart();
    values.login = values.login.toLowerCase().trim().trimStart();
    values.password = values.password.trim().trimStart();

    try {
      const response = await axios.post('/pedagogium-teachers/new', values);
      setIsLoading(isLoading => (isLoading = true));
      console.log(response);
      resetForm();
      alert('Nauczyciela dodano');
      setIsTimeToUpdate(isTime => !isTime);
    } catch (error) {
      console.error(error);
      alert(
        'Wystąpił nieoczekiwany błąd serwera. Proszę odświeżyć stronę i spróbować ponownie. W przypadku dalszych problemów prosimy o kontakt z pomocą techniczną.'
      );
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  const handleEdit = async id => {
    setIsEditFormOpen(true);
    setTeacherToEdit(
      teacherToEdit =>
        (teacherToEdit = teachers.find(teacher => teacher._id === id))
    );
  };

  const closeEditForm = e => {
    setIsEditFormOpen(false);
  };

  const closeEditFormOnClick = e => {
    if (e.target.id === 'close-on-click') {
      setIsEditFormOpen(false);
    }
  };

  const handleDelete = async id => {
    setIsLoading(isLoading => (isLoading = true));
    const areYouSure = window.confirm(
      `Na pewno usunąć ${teachers.find(teacher => teacher._id === id).name}?`
    );

    if (!areYouSure) {
      setIsLoading(isLoading => (isLoading = false));
      return;
    } else {
      try {
        const response = await axios.delete(`/pedagogium-teachers/${id}`);
        console.log(response);
        alert('Nauczyciela usunięto');
        setTeachers(
          teachers =>
            (teachers = [...teachers.filter(teacher => teacher._id !== id)])
        );
      } catch (error) {
        console.error(error);
        alert(
          'Wystąpił nieoczekiwany błąd serwera. Proszę odświeżyć stronę i spróbować ponownie. W przypadku dalszych problemów prosimy o kontakt z pomocą techniczną.'
        );
      } finally {
        setIsLoading(isLoading => (isLoading = false));
      }
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
              <Label>
                <AdminInput type="text" name="login" placeholder="Login" />
                <AdminInputNote component="p" name="login" />
              </Label>
              <Label>
                <AdminInput
                  type="password"
                  name="password"
                  placeholder="Hasło"
                />
                <AdminInputNote component="p" name="password" />
              </Label>
              <AdminFormBtn type="submit">Zaloguj się</AdminFormBtn>
            </LoginForm>
          </Formik>
        )}

        {isUserAdmin && (
          <Formik
            initialValues={initialTeacherValues}
            onSubmit={handleTeacherSubmit}
            validationSchema={teachersSchema}
          >
            <UsersForm>
              <Label>
                <AdminInput
                  type="text"
                  name="name"
                  placeholder="Nazwisko i imię"
                />
                <AdminInputNote component="p" name="name" />
              </Label>
              <Label>
                <AdminInput type="text" name="login" placeholder="Login" />
                <AdminInputNote component="p" name="login" />
              </Label>
              <Label>
                <AdminInput type="text" name="password" placeholder="Hasło" />
                <AdminInputNote component="p" name="password" />
              </Label>
              <Label>
                <AdminInput
                  type="text"
                  name="platformId"
                  placeholder="ID platformy"
                />
                <AdminInputNote component="p" name="platformId" />
              </Label>
              <AdminFormBtn type="submit">Dodaj nauczyciela</AdminFormBtn>
            </UsersForm>
          </Formik>
        )}
        {isUserAdmin && (
          <UserDBTable>
            <UserDBCaption>Lista kont nauczycieli</UserDBCaption>
            <thead>
              <UserDBRow>
                <UserHeadCell>Imię i nazwisko</UserHeadCell>
                <UserHeadCell>Login</UserHeadCell>
                <UserHeadCell>Hasło</UserHeadCell>
                <UserHeadCell>ID na platformie</UserHeadCell>
                <UserHeadCell>Odwiedziny</UserHeadCell>
                <UserHeadCell>Odwiedziny z czasem</UserHeadCell>
                <UserHeadCell>Edit</UserHeadCell>
                <UserHeadCell>Delete</UserHeadCell>
              </UserDBRow>
            </thead>
            <tbody>
              {teachers
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(teacher => (
                  <UserDBRow key={teacher._id}>
                    <UserCell>{teacher.name}</UserCell>
                    <UserCell>{teacher.login}</UserCell>
                    <UserCell>{teacher.password}</UserCell>
                    <UserCell>{teacher.platformId}</UserCell>
                    <UserCell>
                      {teacher.visited[teacher.visited.length - 1]}
                    </UserCell>
                    <UserCell>
                      {teacher.visitedTime.length
                        ? new Date(
                            changeDateFormat(
                              teacher.visitedTime[
                                teacher.visitedTime.length - 1
                              ]
                            )
                          ).toLocaleString('uk-UA', { timeZone: '+03:00' })
                        : ''}
                    </UserCell>
                    <UserCell>
                      {teacher.name === 'Dev Acc' ? null : (
                        <UserEditButton onClick={() => handleEdit(teacher._id)}>
                          Edit
                        </UserEditButton>
                      )}
                    </UserCell>
                    <UserCell>
                      {teacher.name === 'Dev Acc' ? null : (
                        <UserDeleteButton
                          onClick={() => handleDelete(teacher._id)}
                        >
                          Del
                        </UserDeleteButton>
                      )}
                    </UserCell>
                  </UserDBRow>
                ))}
            </tbody>
          </UserDBTable>
        )}
        {isEditFormOpen && (
          <Backdrop onMouseDown={closeEditFormOnClick} id="close-on-click">
            <TeacherEditForm
              teacherToEdit={teacherToEdit}
              closeEditForm={closeEditForm}
            />
          </Backdrop>
        )}
        {isLoading && <Loader />}
      </AdminPanelSection>
    </>
  );
};

export default TeacherAdminPanel;
