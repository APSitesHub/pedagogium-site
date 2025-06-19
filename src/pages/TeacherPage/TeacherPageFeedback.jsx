import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  AdminFormBtn,
  AdminInput,
  AdminInputNote,
  AdminPanelSection,
  LoginForm,
  SpeakingSelect,
  UserCell,
  UserCellLeft,
  UserDBRow,
  UserEditButton,
} from 'pages/AdminPanel/TeacherAdminPanel.styled';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import { Formik } from 'formik';
import { Loader } from 'components/SharedLayout/Loaders/Loader';
import * as yup from 'yup';
import {
  BoxHideLeftSwitch,
  BoxHideRightSwitch,
  BoxHideSwitch,
  ButtonBox,
} from 'components/Stream/Stream.styled';
import {
  TeacherSpeakingDBSection,
  TeacherSpeakingDBTable,
} from './TeacherPage.styled';
import {
  UserDBCaption,
  UserHeadCell,
} from 'pages/Streams/UserAdminPanel/UserAdminPanel.styled';
import { Backdrop } from 'components/LeadForm/Backdrop/Backdrop.styled';
import { UserFeedbackEditForm } from './EditForms/UserFeedbackEditForm';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

const setAuthToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const TeacherPageFeedback = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [visibleGroupName, setVisibleGroupName] = useState('');
  const [isButtonBoxOpen, setIsButtonBoxOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState({});
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const initialLoginValues = {
    login: '',
    password: '',
  };

  const loginSchema = yup.object().shape({
    login: yup.string().required('Podaj login!'),
    password: yup.string().required('Wprowadź hasło!'),
  });

  const toggleButtonBox = () => {
    setIsButtonBoxOpen(isOpen => !isOpen);
  };

  const handleBackdropClick = e => {
    if (e.target.id === 'close-on-click') {
      setIsEditFormOpen(false);
    }
  };

  const handleLoginSubmit = async (values, { resetForm }) => {
    setIsLoading(isLoading => (isLoading = true));
    try {
      const response = await axios.post('/pedagogium-teachers/login/', values);
      setAuthToken(response.data.token);
      setIsUserAdmin(isAdmin => (isAdmin = true));
      localStorage.setItem('mail', response.data.teacher.login);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  const handleSelectCourse = item => {
    setSelectedCourse(courses.find(course => course.slug === item.value));
  };

  const handleSelectGroup = item => {
    setSelectedGroup(item.value);
  };

  const handleGetUsers = async () => {
    try {
      const response = await axios.get(
        `/pedagogium-users/byGroup/${selectedCourse.courseName}/${selectedGroup}`
      );

      setUsers(response.data);
      setVisibleGroupName(`${selectedCourse.courseName} - ${selectedGroup}`);
      setIsButtonBoxOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserEdit = async user => {
    setUserToEdit(user);
    setIsEditFormOpen(true);
  };

  const updateFeedback = updatedUser => {
    setUsers(users =>
      users.map(user => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const getLatestFeedback = feedbacks => {
    if (!feedbacks || feedbacks.length === 0) return '';

    const parseDate = str => {
      const [day, month, year] = str.split('.').map(Number);
      return new Date(year, month - 1, day);
    };

    const latestFeedback = feedbacks.reduce((latest, current) => {
      return parseDate(current.date) > parseDate(latest.date)
        ? current
        : latest;
    });

    return latestFeedback.feedback;
  };

  useEffect(() => {
    const refreshToken = async () => {
      console.log('token refresher');
      try {
        const res = await axios.post('/pedagogium-teachers/refresh/', {
          login: localStorage.getItem('mail'),
        });
        setAuthToken(res.data.newToken);
        setIsUserAdmin(isAdmin => (isAdmin = true));
      } catch (error) {
        console.log(error);
      }
    };
    refreshToken();

    const getCourses = async () => {
      const response = await axios.get('/pedagogium-courses/admin');

      setCourses(response.data);
    };

    getCourses();
  }, []);

  return (
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
              <AdminInput type="password" name="password" placeholder="Hasło" />
              <AdminInputNote component="p" name="password" />
            </Label>
            <AdminFormBtn type="submit">Zaloguj się</AdminFormBtn>
          </LoginForm>
        </Formik>
      )}
      {isUserAdmin && (
        <>
          <ButtonBox
            className={!isButtonBoxOpen ? 'hidden' : ''}
            style={{
              backgroundColor: '#fff',
              padding: '8px',
              border: '1px solid gray',
              borderRadius: '24px',
              top: '100px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {courses.length && (
              <>
                <SpeakingSelect
                  options={courses.map(course => ({
                    label: course.courseName,
                    value: course.slug,
                  }))}
                  placeholder="Kurs"
                  onChange={handleSelectCourse}
                />
                <SpeakingSelect
                  options={
                    selectedCourse?.courseGroups?.map(group => ({
                      label: group,
                      value: group,
                    })) || []
                  }
                  placeholder="Grupę"
                  onChange={handleSelectGroup}
                  isDisabled={!selectedCourse}
                />

                <AdminFormBtn type="button" onClick={handleGetUsers}>
                  <FormBtnText>Szukaj</FormBtnText>
                </AdminFormBtn>
              </>
            )}
          </ButtonBox>

          <BoxHideSwitch id="no-transform" onClick={toggleButtonBox}>
            {isButtonBoxOpen ? <BoxHideLeftSwitch /> : <BoxHideRightSwitch />}
          </BoxHideSwitch>

          <TeacherSpeakingDBSection style={{ flex: '1' }}>
            <TeacherSpeakingDBTable>
              <UserDBCaption>{visibleGroupName}</UserDBCaption>
              <thead>
                <UserHeadCell>№</UserHeadCell>
                <UserHeadCell>Name</UserHeadCell>
                <UserHeadCell>Edit</UserHeadCell>
                <UserHeadCell>Visited</UserHeadCell>
                <UserHeadCell>Feedback</UserHeadCell>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <UserDBRow key={user._id}>
                    <UserCell>{i + 1}</UserCell>
                    <UserCell>{user.name}</UserCell>
                    <UserCell>
                      <UserEditButton onClick={() => handleUserEdit(user)}>
                        Edit
                      </UserEditButton>
                    </UserCell>
                    <UserCell>
                      {user.visited && user.visited[user.visited.length - 1]}
                    </UserCell>
                    <UserCellLeft style={{ whiteSpace: 'pre-wrap' }}>
                      {getLatestFeedback(user.feedbacks)}
                    </UserCellLeft>
                  </UserDBRow>
                ))}
              </tbody>
            </TeacherSpeakingDBTable>

            {isEditFormOpen && (
              <Backdrop id="close-on-click" onMouseDown={handleBackdropClick}>
                <UserFeedbackEditForm
                  userToEdit={userToEdit}
                  updateFeedback={updateFeedback}
                  closeEditForm={() => setIsEditFormOpen(false)}
                />
              </Backdrop>
            )}
          </TeacherSpeakingDBSection>
        </>
      )}

      {isLoading && <Loader />}
    </AdminPanelSection>
  );
};

export default TeacherPageFeedback;
