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
import {
  AdminButtonBoxSwitch,
  FormField,
} from 'pages/AdminPanel/TeacherAdminPanel.styled';
import { LoginErrorNote } from 'pages/MyPedagogium/MyPedagogiumPanel/MyPedagogiumPanel.styled';
import {
  AdminFormBtn,
  LoginForm,
} from 'pages/Streams/AdminPanel/AdminPanel.styled';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import {
  PanelHeader,
  SubmitFormBtn,
} from '../CourseAdminPanel/CourseAdminPanel.styled';
import {
  AdminInput,
  AdminInputNote,
  AdminPanelSection,
  ArrowDownIcon,
  ErrorNote,
  FormSelect,
  LabelText,
  SpeakingLabel,
  UserCell,
  UserDBCaption,
  UserDBRow,
  UserDBTable,
  UserDeleteButton,
  UserEditButton,
  UserHeadCell,
  UsersForm,
} from './UserAdminPanel.styled';
import { UniUserEditForm } from './UserEditForm/UniUserEditForm';
import { UserVisitedEditForm } from './UserEditForm/UserVisitedEditForm';
import SideAdminMenu from 'pages/AdminPanel/SideAdminMenu';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

const setAuthToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const University = {
  PEDAGOGIUM: 'Pedagogium (Wyższa Szkoła Nauk Społecznych)',
};

const translations = {
  pl: {
    loginPlaceholder: 'Login',
    passwordPlaceholder: 'Hasło',
    loginRequired: 'Podaj login!',
    passwordRequired: 'Podaj hasło!',
    loginButton: 'Zaloguj się',
    addUserButton: 'Dodaj użytkownika',
    userListCaption: 'Lista studentów z dostępem do lekcji',
    crmLeadContact: 'CRM&nbsp;Lider Kontakt',
    name: 'Nazwisko i imię',
    email: 'Poczta (login)',
    password: 'Hasło',
    university: 'Uniwersytet',
    group: 'Grupa',
    points: 'Punkty',
    platformId: 'ID na platformie',
    attendance: 'Obecność',
    percentage: 'Procent obecności',
    visitsWithTime: 'Odwiedziny z czasem',
    deleteUserConfirmation: 'Czy na pewno usunąć',
    userDeleted: 'Użytkownik został usunięty',
    edit: 'Edytuj',
    delete: 'Usuń',
    deleteUserError:
      'Wystąpił nieoczekiwany błąd serwera. Proszę odświeżyć stronę i spróbować ponownie. W przypadku dalszych problemów prosimy o kontakt z pomocą techniczną.',
    addUserError:
      'Wystąpił nieoczekiwany błąd serwera. Proszę odświeżyć stronę i spróbować ponownie. W przypadku dalszych problemów prosimy o kontakt z pomocą techniczną.',
    userAdded: 'Użytkownik został dodany',
    userUpdated: 'Użytkownik został zaktualizowany',
    updateUserError: 'Błąd podczas aktualizacji użytkownika',
    universityRequired: 'Uniwersytet - obowiązkowe pole!',
    groupRequired: 'Grupa - obowiązkowe pole!',
    userNameRequired:
      'Imię - obowiązkowe pole, jeśli imienia z jakiegoś powodu nie znamy, wpisz N/A',
    userEmailRequired: 'Poczta - obowiązkowe pole!',
    userPasswordRequired: 'Hasło - obowiązkowe pole!',
    crmIdDigitsOnly: 'Tylko cyfry',
    contactIdDigitsOnly: 'Tylko cyfry',
    pupilIdDigitsOnly: 'Tylko cyfry',
    pupilIdMinLength: 'Nie mniej niż 6 cyfr',
    pupilIdMaxLength: 'Nie więcej niż 7 cyfr',
    pupilIdRequired: 'Obowiązkowe pole, sprawdź na platformie',
    course: 'Kurs',
    coursePlaceholder: 'Wybierz kurs',
    courseRequired: 'Kurs jest wymagany!',
  },
};

const UniUserAdminPanel = ({ uni, lang = 'pl' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isVisitedEditFormOpen, setIsVisitedEditFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState({});
  const [courseValue, setCourseValue] = useState(null);
  const [groupValue, setGroupValue] = useState(null);
  const [isGroupEmpty, setIsGroupEmpty] = useState(false);
  const [isUserInfoIncorrect, setIsUserInfoIncorrect] = useState(false);
  const [isButtonBoxOpen, setIsButtonBoxOpen] = useState(true);
  const [daysAfterLastLogin] = useState(7);
  const selectInputRef = useRef();

  // Створюємо опції для курсів
  const courseOptions = useMemo(
    () =>
      courses.map(course => ({
        label: course.courseName,
        value: course.courseName,
        groups: course.courseGroups,
      })),
    [courses]
  );

  // Створюємо опції для груп базуючиcь на вибраному курсі
  const currentGroupOptions = useMemo(() => {
    // Базові опції для груп
    const defaultGroupOptions = [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: '10', value: '10' },
    ];

    if (courseValue && courseValue.groups) {
      return courseValue.groups.map(group => ({
        label: group.toString(),
        value: group.toString(),
      }));
    }
    return defaultGroupOptions;
  }, [courseValue]);

  useEffect(() => {
    document.title = 'Panel studentów | Pedagogium';

    const refreshToken = async () => {
      
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

    const getUsers = async () => {
      try {
        if (isUserAdmin) {
          const response = await axios.get(
            `/pedagogium-users/admin/${uni ? uni.toLowerCase() : ''}`
          );

          setUsers(
            users =>
              (users = [
                ...response.data
                  .reverse()
                  .sort((a, b) => a.name.localeCompare(b.name)),
              ])
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();

    const getCourses = async () => {
      try {
        if (isUserAdmin) {
          const response = await axios.get('/pedagogium-courses/admin/');
          setCourses(
            response.data.sort((a, b) =>
              a.courseName.localeCompare(b.courseName)
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    getCourses();

    const onEscapeClose = event => {
      if (event.code === 'Escape') {
        closeEditForm();
      }
    };

    window.addEventListener('keydown', onEscapeClose);

    return () => {
      window.removeEventListener('keydown', onEscapeClose);
    };
  }, [isUserAdmin, isEditFormOpen, isLoading, uni]);

  const initialLoginValues = {
    login: '',
    password: '',
  };

  const loginSchema = yup.object().shape({
    login: yup.string().required(translations[lang]?.loginRequired),
    password: yup.string().required(translations[lang]?.passwordRequired),
  });

  const toggleButtonBox = () => {
    setIsButtonBoxOpen(isOpen => !isOpen);
  };

  const onClear = () => {
    selectInputRef.current.clearValue();
  };

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
      const response = await axios.post('/admins/login/pedagogium', values);
      setAuthToken(response.data.token);
      setIsUserAdmin(isAdmin => (isAdmin = true));
      localStorage.setItem('isAdmin', true);
      resetForm();
    } catch (error) {
      error.response.status === 401 && setIsUserInfoIncorrect(true);
      console.error(error);
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  const initialUserValues = {
    name: '',
    mail: '',
    password: '',
    crmId: '',
    contactId: '',
    pupilId: '',
    university: '',
    group: '',
  };

  const usersSchema = yup.object().shape({
    name: yup.string().required(translations[lang]?.userNameRequired),
    mail: yup.string().required(translations[lang]?.userEmailRequired),
    password: yup.string().required(translations[lang]?.userPasswordRequired),
    crmId: yup
      .string()
      .matches(/^[0-9]*$/, translations[lang]?.crmIdDigitsOnly),
    contactId: yup
      .string()
      .matches(/^[0-9]*$/, translations[lang]?.contactIdDigitsOnly),
    pupilId: yup
      .string()
      .min(6, translations[lang]?.pupilIdMinLength)
      .max(7, translations[lang]?.pupilIdMaxLength)
      .matches(/^\d{1,7}$/, translations[lang]?.pupilIdDigitsOnly)
      .required(translations[lang]?.pupilIdRequired),
  });

  const handleUserSubmit = async (values, { resetForm }) => {
    setIsLoading(isLoading => (isLoading = true));
    values.name = values.name.trim().trimStart();
    values.mail = values.mail.toLowerCase().trim().trimStart();
    values.password = values.password.trim().trimStart();
    values.crmId = values.crmId ? +values.crmId.trim().trimStart() : undefined;
    values.contactId = values.contactId
      ? +values.contactId.trim().trimStart()
      : undefined;
    values.pupilId = values.pupilId.trim().trimStart();
    values.university = uni
      ? University[uni]
      : 'Pedagogium (Wyższa Szkoła Nauk Społecznych)';
    values.group = groupValue ? groupValue.value : '1';
    values.courseName = courseValue ? courseValue.value : null;

    if (!courseValue) {
      alert('Wybierz kurs!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/pedagogium-users/new', values);
      console.log(response.data);
      setUsers(users => [response.data, ...users]);
      resetForm();
      setCourseValue(null);
      setGroupValue(null);
      onClear();
      alert(translations[lang]?.userAdded);
    } catch (error) {
      console.error(error);
      alert(translations[lang]?.addUserError);
    } finally {
      setIsLoading(isLoading => (isLoading = false));
    }
  };

  const handleEdit = async id => {
    setIsEditFormOpen(true);

    setUserToEdit(
      userToEdit =>
        (userToEdit = {
          ...users.find(user => user._id === id),
          university: University[uni],
        })
    );
  };

  const handleVisitedEdit = async id => {
    setIsVisitedEditFormOpen(true);
    setUserToEdit(
      userToEdit =>
        (userToEdit = {
          ...users.find(user => user._id === id),
          university: University[uni],
        })
    );
  };

  const closeEditForm = e => {
    setIsEditFormOpen(false);
    setIsVisitedEditFormOpen(false);
  };

  const closeEditFormOnClick = e => {
    if (e.target.id === 'close-on-click') {
      setIsEditFormOpen(false);
      setIsVisitedEditFormOpen(false);
    }
  };

  const updateUserVisits = (id, visits) => {
    setUsers(
      users =>
        (users = users.map((user, i) =>
          i === users.findIndex(user => user._id === id)
            ? { ...user, visited: visits }
            : user
        ))
    );
  };

  const updateUser = (id, values) => {
    const userToUpdate = users.find(user => user._id === id);
    userToUpdate.name = values.name;
    userToUpdate.mail = values.mail;
    userToUpdate.password = values.password;
    userToUpdate.pupilId = values.pupilId;
    userToUpdate.points = values.points;
    userToUpdate.contactId = values.contactId;
    if (uni) {
      userToUpdate.university = values.university;
    }
    userToUpdate.courseName = values.courseName;
    userToUpdate.group = values.group;

    console.log(userToUpdate);

    setUsers(
      users =>
        (users = users.map((user, i) =>
          i === users.findIndex(user => user._id === id) ? userToUpdate : user
        ))
    );
  };

  const handleDelete = async id => {
    setIsLoading(isLoading => (isLoading = true));
    const areYouSure = window.confirm(
      `${translations[lang]?.deleteUserConfirmation} ${
        users.find(user => user._id === id).name
      }?`
    );

    if (!areYouSure) {
      setIsLoading(isLoading => (isLoading = false));
      return;
    } else {
      try {
        const response = await axios.delete(`/pedagogium-users/${id}`);
        console.log(response);
        alert(translations[lang]?.userDeleted);
        setUsers(users => (users = [...users.filter(user => user._id !== id)]));
      } catch (error) {
        console.error(error);
        alert(translations[lang]?.deleteUserError);
      } finally {
        setIsLoading(isLoading => (isLoading = false));
      }
    }
  };

  const sortByGroup = () => {
    setUsers(users => [
      ...users.sort((a, b) => {
        if (!a.group) return 1;
        if (!b.group) return -1;
        return a.group.localeCompare(b.group);
      }),
    ]);
  };

  return (
    <>
      <PanelHeader>Panel studentów</PanelHeader>
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
                Błędne hasło lub e-mail.
              </LoginErrorNote>
            </LoginForm>
          </Formik>
        )}

        {isUserAdmin && (
          <>
            <SideAdminMenu
              isOpen={isButtonBoxOpen}
              currentPage={'admin-users'}
            />

            <AdminButtonBoxSwitch id="no-transform" onClick={toggleButtonBox}>
              {isButtonBoxOpen ? <BoxHideLeftSwitch /> : <BoxHideRightSwitch />}
            </AdminButtonBoxSwitch>
            <Formik
              initialValues={initialUserValues}
              onSubmit={handleUserSubmit}
              validationSchema={usersSchema}
            >
              <UsersForm>
                <Label>
                  <FormField
                    type="text"
                    name="name"
                    placeholder={translations[lang]?.name}
                  />
                  <AdminInputNote component="p" name="name" />
                </Label>
                <Label>
                  <FormField
                    type="email"
                    name="mail"
                    placeholder={translations[lang]?.email}
                  />
                  <AdminInputNote component="p" name="mail" />
                </Label>
                <Label>
                  <FormField
                    type="text"
                    name="password"
                    placeholder={translations[lang]?.password}
                  />
                  <AdminInputNote component="p" name="password" />
                </Label>
                <Label>
                  <FormField
                    type="text"
                    name="pupilId"
                    placeholder={translations[lang]?.platformId}
                  />
                  <AdminInputNote component="p" name="pupilId" />
                </Label>
                <SpeakingLabel>
                  {courseValue && courseValue.value && (
                    <LabelText>Kurs</LabelText>
                  )}
                  <FormSelect
                    ref={selectInputRef}
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
                    placeholder="Wybierz kurs"
                    name="course"
                    onChange={course => {
                      setCourseValue(course);
                      // Скидаємо значення групи при зміні курсу
                      setGroupValue(null);
                    }}
                  />
                </SpeakingLabel>
                <SpeakingLabel>
                  {groupValue && groupValue.value && (
                    <LabelText>{translations[lang]?.group}</LabelText>
                  )}
                  <FormSelect
                    ref={selectInputRef}
                    options={currentGroupOptions}
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
                    placeholder={translations[lang]?.group}
                    name="group"
                    isDisabled={!courseValue}
                    onBlur={() => {
                      !groupValue
                        ? setIsGroupEmpty(empty => (empty = true))
                        : setIsGroupEmpty(empty => (empty = false));
                    }}
                    onChange={group => {
                      setGroupValue(group);
                      group?.value && setIsGroupEmpty(empty => (empty = false));
                    }}
                  />
                  {isGroupEmpty && (
                    <ErrorNote>{translations[lang]?.groupRequired}</ErrorNote>
                  )}
                </SpeakingLabel>
                <SubmitFormBtn type="submit">
                  <FormBtnText>{translations[lang]?.addUserButton}</FormBtnText>
                </SubmitFormBtn>
              </UsersForm>
            </Formik>
          </>
        )}

        {isUserAdmin && users && (
          <UserDBTable>
            <UserDBCaption>{translations[lang]?.userListCaption}</UserDBCaption>
            <thead>
              <UserDBRow>
                <UserHeadCell>№</UserHeadCell>
                {!uni && (
                  <UserHeadCell>
                    {translations[lang]?.crmLeadContact}
                  </UserHeadCell>
                )}
                <UserHeadCell>{translations[lang]?.name}</UserHeadCell>
                <UserHeadCell>{translations[lang]?.email}</UserHeadCell>
                {!uni && (
                  <UserHeadCell>{translations[lang]?.password}</UserHeadCell>
                )}
                {!uni && (
                  <UserHeadCell>{translations[lang]?.university}</UserHeadCell>
                )}
                <UserHeadCell>Kurs</UserHeadCell>
                <UserHeadCell style={{ whiteSpace: 'nowrap' }}>
                  {translations[lang]?.group}
                  <button
                    style={{
                      padding: '0',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      marginLeft: '4px',
                    }}
                    onClick={sortByGroup}
                  >
                    <ArrowDownIcon />
                  </button>
                </UserHeadCell>
                <UserHeadCell>{translations[lang]?.points}</UserHeadCell>
                <UserHeadCell>{translations[lang]?.platformId}</UserHeadCell>
                <UserHeadCell>{translations[lang]?.attendance}</UserHeadCell>
                {!uni && (
                  <UserHeadCell>
                    {translations[lang]?.visitsWithTime}
                  </UserHeadCell>
                )}
                <UserHeadCell>Edit</UserHeadCell>
                <UserHeadCell>Delete</UserHeadCell>
              </UserDBRow>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <UserDBRow key={user._id}>
                  <UserCell>{index + 1}</UserCell>
                  {!uni && (
                    <UserCell>
                      <a
                        href={`https://apeducation.kommo.com/leads/detail/${user.crmId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {user.crmId}
                      </a>{' '}
                      <a
                        href={`https://apeducation.kommo.com/contacts/detail/${user.contactId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {user.contactId}
                      </a>
                    </UserCell>
                  )}
                  <UserCell>{user.name}</UserCell>
                  <UserCell>{user.mail}</UserCell>
                  {!uni && <UserCell>{user.password}</UserCell>}
                  {!uni && (
                    <UserCell className="last-name">{user.university}</UserCell>
                  )}
                  <UserCell>{user.courseName || '-'}</UserCell>
                  <UserCell>{user.group || '1'}</UserCell>
                  <UserCell>{user.points ? user.points : '0'}</UserCell>
                  <UserCell>{user.pupilId}</UserCell>
                  <UserCell
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => handleVisitedEdit(user._id)}
                    className={
                      Math.floor(
                        (Date.now() -
                          changeDateFormat(
                            user.visited[user.visited.length - 1]
                          )) /
                          86400000
                      ) > daysAfterLastLogin
                        ? 'attention'
                        : ''
                    }
                  >
                    {user.visited[user.visited.length - 1]}
                  </UserCell>
                  {!uni && (
                    <UserCell>
                      {!user.visitedTime[user.visitedTime.length - 1]
                        ? ''
                        : user.visitedTime[user.visitedTime.length - 1].match(
                            '^202'
                          )
                        ? new Date(
                            user.visitedTime[user.visitedTime.length - 1]
                          ).toLocaleString('uk-UA')
                        : new Date(
                            changeDateFormat(
                              user.visitedTime[user.visitedTime.length - 1]
                            )
                          ).toLocaleString('uk-UA', { timeZone: '+06:00' })}
                    </UserCell>
                  )}

                  <UserCell>
                    <UserEditButton onClick={() => handleEdit(user._id)}>
                      Edit
                    </UserEditButton>
                  </UserCell>
                  <UserCell>
                    {user.name === 'Dev Acc' ? null : (
                      <UserDeleteButton onClick={() => handleDelete(user._id)}>
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
            <UniUserEditForm
              uni={uni}
              lang={lang}
              userToEdit={userToEdit}
              updateUser={updateUser}
              closeEditForm={closeEditForm}
              University={University}
              courseOptions={courseOptions}
              groupOptions={currentGroupOptions}
            />
          </Backdrop>
        )}
        {isVisitedEditFormOpen && (
          <Backdrop onMouseDown={closeEditFormOnClick} id="close-on-click">
            <UserVisitedEditForm
              lang={lang}
              userToEdit={userToEdit}
              updateUserVisits={updateUserVisits}
              closeEditForm={closeEditForm}
            />
          </Backdrop>
        )}
        {isLoading && <Loader />}
      </AdminPanelSection>
    </>
  );
};

export default UniUserAdminPanel;
