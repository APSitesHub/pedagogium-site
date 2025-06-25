import axios from 'axios';
import { Backdrop } from 'components/LeadForm/Backdrop/Backdrop.styled';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import { Loader } from 'components/SharedLayout/Loaders/Loader';
import {
  BoxHideLeftSwitch,
  BoxHideRightSwitch,
  LoginLogo,
} from 'components/Stream/Stream.styled';
import { Formik } from 'formik';
import { AdminFormBtn, LoginForm } from '../AdminPanel/AdminPanel.styled';
import { LoginErrorNote } from 'pages/MyPedagogium/MyPedagogiumPanel/MyPedagogiumPanel.styled';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  AdminInput,
  AdminInputNote,
  AdminPanelSection,
  FormSelect,
  UserEditButton,
  UsersForm,
} from '../UserAdminPanel/UserAdminPanel.styled';
import {
  ScheduleData,
  ScheduleDataDayText,
  ScheduleDataTimeText,
  ScheduleHeading,
  ScheduleInfo,
  ScheduleItem,
  ScheduleList,
  TimetableDeleteButton,
} from './TimeTableAdminPanel.styled';
import { TimeTableEditForm } from './TimeTableEditForm/TimeTableEditForm';
import {
  PanelHeader,
  SubmitFormBtn,
} from '../CourseAdminPanel/CourseAdminPanel.styled';
import {
  AdminButtonBoxSwitch,
  FormField,
} from 'pages/AdminPanel/TeacherAdminPanel.styled';
import SideAdminMenu from 'pages/AdminPanel/SideAdminMenu';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';
const setAuthToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const TimeTableAdminPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lessonToEdit, setLessonToEdit] = useState({});
  const [scheduleToEdit, setScheduleToEdit] = useState('');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isUserInfoIncorrect, setIsUserInfoIncorrect] = useState(false);
  const [isButtonBoxOpen, setIsButtonBoxOpen] = useState(true);
  const [courseValue, setCourseValue] = useState(null);
  const [groupValue, setGroupValue] = useState(null);
  const [dayValue, setDayValue] = useState(null);

  useEffect(() => {
    document.title = 'Panel harmonogramów | Pedagogium';

    const refreshToken = async () => {
      console.log('token refresher');
      try {
        if (localStorage.getItem('isAdmin')) {
          const res = await axios.post('admins/refresh/users/', {});
          console.log(res);
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
          const response = await axios.get('/pedagogium-courses/admin');
          console.log(response);
          setCourses(courses => (courses = [...response.data]));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCourses();

    const getLessons = async () => {
      try {
        if (isUserAdmin) {
          const response = await axios.get('/pedagogium-timetable/');
          console.log(response);
          setLessons(lessons => (lessons = [...response.data]));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getLessons();

    const onEscapeClose = event => {
      if (event.code === 'Escape' && isEditFormOpen) {
        closeEditForm();
      }
    };

    window.addEventListener('keydown', onEscapeClose);

    return () => {
      window.removeEventListener('keydown', onEscapeClose);
    };
  }, [isUserAdmin, isLoading, isEditFormOpen]);

  const DAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

  const initialLoginValues = {
    login: '',
    password: '',
  };

  const loginSchema = yup.object().shape({
    login: yup.string().required('Podaj login!'),
    password: yup.string().required('Podaj hasło!'),
  });

  const toggleButtonBox = () => {
    setIsButtonBoxOpen(isOpen => !isOpen);
  };

  const handleLoginSubmit = async (values, { resetForm }) => {
    setIsLoading(isLoading => (isLoading = true));
    try {
      const response = await axios.post('/admins/login/users', values);
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

  const initialTimetableValues = {
    group: '',
    day: '',
    time: '',
    lessonNumber: '',
    topic: '',
  };

  const timetableSchema = yup.object().shape({
    group: yup.string(),
    day: yup.string(),
    time: yup.string(),
    lessonNumber: yup.string(),
    topic: yup.string(),
  });

  const handleTimetableSubmit = async (values, { resetForm }) => {
    values = {
      group: groupValue,
      schedule: [
        {
          day: dayValue,
          time: values.time,
          lessonNumber: values.lessonNumber,
          topic: values.topic,
        },
      ],
    };
    setCourseValue(course => (course = null));
    setGroupValue(group => (group = null));
    setDayValue(day => (day = null));

    setIsLoading(isLoading => (isLoading = true));
    try {
      const response = await axios.post('/pedagogium-timetable', values);
      console.log(response);
      resetForm();
      alert('Lekcja pomyślnie dodana');
    } catch (error) {
      console.error(error);
      alert(
        'Wystąpił nieoczekiwany błąd serwera. Proszę odświeżyć stronę i spróbować ponownie. W przypadku dalszych problemów prosimy o kontakt z pomocą techniczną.'
      );
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  const closeEditForm = e => {
    setIsEditFormOpen(false);
  };

  const courseOptions = courses.map(
    course =>
      (course = {
        label: `${course.courseName} `,
        value: `${course.slug}`,
      })
  );

  const groupsOptions = courses.flatMap(
    course =>
      (course = course.courseGroups.map(
        group =>
          (group = {
            label: group,
            value: `${course.slug}_${group}`,
          })
      ))
  );

  const daysOptions = [
    {
      label: 'Poniedziałek',
      value: '1',
    },
    {
      label: 'Wtorek',
      value: '2',
    },
    {
      label: 'Środa',
      value: '3',
    },
    {
      label: 'Czwartek',
      value: '4',
    },
    {
      label: 'Piątek',
      value: '5',
    },
    {
      label: 'Sobota',
      value: '6',
    },
    {
      label: 'Niedziela',
      value: '0',
    },
  ];

  const closeEditFormOnClick = e => {
    if (e.target.id === 'close-on-click') {
      setIsEditFormOpen(false);
    }
  };

  const handleEdit = async (id, scheduleId) => {
    setIsEditFormOpen(true);
    setLessonToEdit(
      lessonToEdit => (lessonToEdit = lessons.find(lesson => lesson._id === id))
    );
    setScheduleToEdit(scheduleToEdit =>
      lessons
        .find(lesson => lesson._id === id)
        .schedule.find(lesson => lesson._id === scheduleId)
    );
  };

  const handleDelete = async (parentId, scheduleId) => {
    setIsLoading(isLoading => (isLoading = true));
    const timetableToDelete = lessons.find(
      timetable => timetable._id === parentId
    );
    const scheduleToDelete = timetableToDelete.schedule.find(
      schedule => schedule._id === scheduleId
    );

    const areYouSure = window.confirm(
      `Czy na pewno chcesz usunąć lekcję grupy ${timetableToDelete.group.replace(
        /(-)|(_)/g,
        ' '
      )} z przedmiotu  ${scheduleToDelete.topic} w ${
        DAYS[scheduleToDelete.day]
      } o ${scheduleToDelete.time}?`
    );

    if (!areYouSure) {
      setIsLoading(isLoading => (isLoading = false));
      return;
    } else {
      try {
        const response = await axios.patch(
          `/pedagogium-timetable/schedule/${parentId}`,
          {
            _id: parentId,
            scheduleId,
          }
        );
        console.log(response);
        alert('Lekcja pomyślnie usunięta');
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

  const handleTimetableDelete = async id => {
    setIsLoading(isLoading => (isLoading = true));
    const timetableToDelete = lessons.find(timetable => timetable._id === id);
    const areYouSure = window.confirm(
      `Czy na pewno chcesz usunąć harmonogram grupy ${timetableToDelete.group.replace(
        /(-)|(_)/g,
        ' '
      )}?`
    );

    if (!areYouSure) {
      setIsLoading(isLoading => (isLoading = false));
      return;
    } else {
      try {
        const response = await axios.delete(`/pedagogium-timetable/${id}`);
        console.log(312, response);
        alert('Harmonogram pomyślnie usunięty');
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
      <PanelHeader>Panel harmonogramów</PanelHeader>
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
                  placeholder="Login"
                  onBlur={() => setIsUserInfoIncorrect(false)}
                />
                <AdminInputNote component="p" name="login" />
              </Label>
              <Label>
                <AdminInput
                  type="password"
                  name="password"
                  placeholder="Hasło"
                  onBlur={() => setIsUserInfoIncorrect(false)}
                />
                <AdminInputNote component="p" name="password" />
              </Label>
              <AdminFormBtn type="submit">
                <FormBtnText>Zaloguj się</FormBtnText>
              </AdminFormBtn>
              <LoginErrorNote
                style={
                  isUserInfoIncorrect ? { opacity: '1' } : { opacity: '0' }
                }
              >
                Błędne hasło lub e-mail.
              </LoginErrorNote>
            </LoginForm>
          </Formik>
        )}

        {isUserAdmin && (
          <>
            <SideAdminMenu
              isOpen={isButtonBoxOpen}
              currentPage={'admin-timetable'}
            />

            <AdminButtonBoxSwitch id="no-transform" onClick={toggleButtonBox}>
              {isButtonBoxOpen ? <BoxHideLeftSwitch /> : <BoxHideRightSwitch />}
            </AdminButtonBoxSwitch>
            <Formik
              initialValues={initialTimetableValues}
              onSubmit={handleTimetableSubmit}
              validationSchema={timetableSchema}
            >
              <UsersForm>
                <FormSelect
                  value={courseValue ? courseValue.value : null}
                  options={courseOptions}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      border: 'none',
                      borderRadius: '50px',
                      minHeight: '38px',
                    }),
                    menu: (baseStyles, state) => ({
                      ...baseStyles,
                      position: 'absolute',
                      zIndex: '2',
                      top: '36px',
                    }),
                    dropdownIndicator: (baseStyles, state) => ({
                      ...baseStyles,
                      padding: '7px',
                    }),
                  }}
                  placeholder="Kurs"
                  name="course"
                  onChange={course => {
                    setCourseValue(course.value);
                  }}
                />
                <FormSelect
                  value={groupValue ? groupValue.value : null}
                  options={groupsOptions.filter(option =>
                    option.value.includes(courseValue)
                  )}
                  isDisabled={!courseValue ? true : false}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      border: 'none',
                      borderRadius: '50px',
                      minHeight: '38px',
                    }),
                    menu: (baseStyles, state) => ({
                      ...baseStyles,
                      position: 'absolute',
                      zIndex: '2',
                      top: '36px',
                    }),
                    dropdownIndicator: (baseStyles, state) => ({
                      ...baseStyles,
                      padding: '7px',
                    }),
                  }}
                  placeholder="Grupa"
                  name="group"
                  onChange={group => {
                    setGroupValue(group.value);
                  }}
                />
                <FormSelect
                  value={dayValue ? dayValue.value : null}
                  options={daysOptions}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      border: 'none',
                      borderRadius: '50px',
                      minHeight: '38px',
                    }),
                    menu: (baseStyles, state) => ({
                      ...baseStyles,
                      position: 'absolute',
                      zIndex: '2',
                      top: '36px',
                    }),
                    dropdownIndicator: (baseStyles, state) => ({
                      ...baseStyles,
                      padding: '7px',
                    }),
                  }}
                  placeholder="Dzień tygodnia"
                  name="day"
                  onChange={day => {
                    setDayValue(day.value);
                  }}
                />
                <Label>
                  <FormField type="text" name="time" placeholder="Czas" />
                  <AdminInputNote component="p" name="time" />
                </Label>
                <Label>
                  <FormField
                    type="text"
                    name="lessonNumber"
                    placeholder="Numer lekcji"
                  />
                  <AdminInputNote component="p" name="lessonNumber" />
                </Label>
                <Label>
                  <FormField type="text" name="topic" placeholder="Przedmiot" />
                  <AdminInputNote component="p" name="topic" />
                </Label>
                <SubmitFormBtn type="submit">
                  <FormBtnText>Dodaj</FormBtnText>
                </SubmitFormBtn>
              </UsersForm>
            </Formik>
          </>
        )}
        <ScheduleList>
          {lessons &&
            lessons
              .sort((a, b) => a.group.localeCompare(b.group))
              .map(timetable => (
                <ScheduleItem key={timetable._id}>
                  <ScheduleHeading>
                    {timetable.group.replace(/(-)|(_)/g, ' ')}
                    <TimetableDeleteButton
                      onClick={() => handleTimetableDelete(timetable._id)}
                    >
                      Usuń
                    </TimetableDeleteButton>
                  </ScheduleHeading>

                  <ScheduleInfo>
                    {timetable.schedule
                      .sort((a, b) => a.day - b.day)
                      .map(schedule => (
                        <ScheduleData key={schedule._id}>
                          <ScheduleDataDayText>
                            {DAYS[schedule.day - 1] || DAYS[DAYS.length - 1]}
                          </ScheduleDataDayText>
                          <ScheduleDataTimeText>
                            {schedule.time}
                          </ScheduleDataTimeText>
                          <ScheduleDataTimeText>
                            {schedule.lessonNumber}
                          </ScheduleDataTimeText>
                          <ScheduleDataTimeText>
                            {schedule.topic}
                          </ScheduleDataTimeText>
                          <UserEditButton
                            onClick={() =>
                              handleEdit(timetable._id, schedule._id)
                            }
                          >
                            Zmień
                          </UserEditButton>

                          <TimetableDeleteButton
                            onClick={() =>
                              handleDelete(timetable._id, schedule._id)
                            }
                          >
                            Usuń
                          </TimetableDeleteButton>
                        </ScheduleData>
                      ))}
                  </ScheduleInfo>
                </ScheduleItem>
              ))}
        </ScheduleList>
        {isEditFormOpen && (
          <Backdrop onMouseDown={closeEditFormOnClick} id="close-on-click">
            <TimeTableEditForm
              lessonToEdit={lessonToEdit}
              scheduleToEdit={scheduleToEdit}
              courseOptions={courseOptions}
              groupsOptions={groupsOptions}
              daysOptions={daysOptions}
              closeEditForm={closeEditForm}
            />
          </Backdrop>
        )}
        {isLoading && <Loader />}
      </AdminPanelSection>
    </>
  );
};

export default TimeTableAdminPanel;
