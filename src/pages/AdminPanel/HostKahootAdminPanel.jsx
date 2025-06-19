import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  AddButton,
  AdminFormBtn,
  AdminInput,
  AdminInputNote,
  AdminPanelSection,
  DefaultInput,
  DeleteButton,
  KahootsAdminContainer,
  LinksContainer,
  LoginForm,
} from './TeacherAdminPanel.styled';
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
import { LinkTo } from 'pages/Streams/CourseAdminPanel/CourseAdminPanel.styled';
import { TeacherLangSelect } from 'pages/Streams/UserAdminPanel/UserAdminPanel.styled';
import { LoginErrorNote } from 'pages/TeacherPage/TeacherPage.styled';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';
// axios.defaults.baseURL = 'http://localhost:3001';

const setAuthToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const KahootAdminPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [links, setLinks] = useState([]);
  const [visibleGroupName, setVisibleGroupName] = useState('');
  const [isButtonBoxOpen, setIsButtonBoxOpen] = useState(true);
  const [customError, setCustomError] = useState('');

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

  const handleSelectCourse = item => {
    setSelectedCourse(courses.find(course => course.slug === item.value));
    setCustomError('');
  };

  const handleSelectGroup = item => {
    setSelectedGroup(item.value);
    setCustomError('');
  };

  const handleFindKahoots = async () => {
    if (!selectedCourse?.slug) {
      setCustomError('Wybierz kurs');
      return;
    }

    if (!selectedGroup) {
      setCustomError('Wybierz grupę');
      return;
    }

    const slug = `${selectedCourse.slug}_${selectedGroup}`;
    const response = await axios.get(`/pedagogium-host-kahoots/${slug}`);

    setLinks({
      group: response.data?.group || slug,
      links: response.data?.links || [],
    });

    setVisibleGroupName(`${selectedCourse.courseName} - ${selectedGroup}`);
  };

  const handleLinkChange = e => {
    const index = Number(e.target.name.split('-')[1]);
    const updatedLinks = [...links.links];
    updatedLinks[index] = e.target.value;

    setLinks(prev => ({
      ...prev,
      links: updatedLinks,
    }));
  };

  const handleAddKahootLink = () => {
    setLinks(prev => ({
      ...prev,
      links: [...prev.links, ''],
    }));
  };

  const handleRemoveLink = indexToRemove => {
    setLinks(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(`/pedagogium-host-kahoots`, {
        group: links.group,
        links: links.links,
      });

      alert('Link został zapisany');
    } catch (e) {
      alert('Wystąpił błąd, spróbuj ponownie');
    }
  };

  useEffect(() => {
    const refreshToken = async () => {
      console.log('token refresher');
      try {
        if (localStorage.getItem('isAdmin')) {
          const res = await axios.post('admins/refresh/pedagogium/', {});
          setAuthToken(res.data.newToken);
          console.log(res);
          setIsUserAdmin(isAdmin => (isAdmin = true));
        }
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
    <>
      <h1
        style={{
          padding: '16px',
          fontSize: '2.5rem',
          textAlign: 'center',
          borderBottom: '1px solid gray',
        }}
      >
        Panel host-kahutów
      </h1>
      <AdminPanelSection style={{ fontSize: '1.5rem' }}>
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
              <AdminFormBtn type="submit">
                <FormBtnText>Zaloguj się</FormBtnText>
              </AdminFormBtn>
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
              <LinkTo to={'/admin'}>Panel kursów</LinkTo>
              <LinkTo to={'/admin-teacher'}>Panel kuratora</LinkTo>
              <LinkTo to={'/admin-users'}>Panel studentów</LinkTo>
              <LinkTo to={'/admin-kahoots'}>Panel kahutów</LinkTo>
              <LinkTo $isDisabled to={'/admin-host-kahoots'}>
                Panel host-kahutów
              </LinkTo>
            </ButtonBox>

            <BoxHideSwitch id="no-transform" onClick={toggleButtonBox}>
              {isButtonBoxOpen ? <BoxHideLeftSwitch /> : <BoxHideRightSwitch />}
            </BoxHideSwitch>
            {courses.length && (
              <KahootsAdminContainer>
                <TeacherLangSelect
                  options={courses.map(course => ({
                    label: course.courseName,
                    value: course.slug,
                  }))}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      border: 'none',
                      borderRadius: '50px',
                      minHeight: '34px',
                      fontSize: '1.5rem',
                    }),
                    menu: (baseStyles, state) => ({
                      ...baseStyles,
                      position: 'absolute',
                      zIndex: '2',
                      top: '36px',
                      fontSize: '1.5rem',
                    }),
                    dropdownIndicator: (baseStyles, state) => ({
                      ...baseStyles,
                      padding: '7px',
                      fontSize: '1.5rem',
                    }),
                  }}
                  placeholder="Kurs"
                  onChange={handleSelectCourse}
                />
                <TeacherLangSelect
                  options={
                    selectedCourse?.courseGroups?.map(group => ({
                      label: group,
                      value: group,
                    })) || []
                  }
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      border: 'none',
                      borderRadius: '50px',
                      minHeight: '34px',
                      fontSize: '1.5rem',
                    }),
                    menu: (baseStyles, state) => ({
                      ...baseStyles,
                      position: 'absolute',
                      zIndex: '2',
                      top: '36px',
                      fontSize: '1.5rem',
                    }),
                    dropdownIndicator: (baseStyles, state) => ({
                      ...baseStyles,
                      padding: '7px',
                      fontSize: '1.5rem',
                    }),
                  }}
                  placeholder="Grupę"
                  onChange={handleSelectGroup}
                  isDisabled={!selectedCourse}
                />

                <AdminFormBtn type="button" onClick={handleFindKahoots}>
                  <FormBtnText>Szukaj</FormBtnText>
                </AdminFormBtn>
                <LoginErrorNote
                  style={{ fontSize: '14px', fontWeight: 'normal' }}
                >
                  {customError}
                </LoginErrorNote>
              </KahootsAdminContainer>
            )}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                border: '1px solid gray',
                borderRadius: '25px',
                padding: '12px 4px 4px 4px',
                minHeight: '360px',
                maxHeight: '100%',
              }}
            >
              {links.group ? (
                <>
                  <h2
                    style={{
                      textAlign: 'center',
                      borderBottom: '1px solid gray',
                      paddingBottom: '8px',
                    }}
                  >
                    {visibleGroupName}
                  </h2>
                  <LinksContainer>
                    {links.links.length ? (
                      links.links.map((link, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <DefaultInput
                            type="text"
                            name={`link-${index}`}
                            placeholder={`Link-${index}`}
                            value={link}
                            onChange={handleLinkChange}
                          />
                          <DeleteButton
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                          >
                            <p>✖</p>
                            <p>usunąć</p>
                          </DeleteButton>
                        </div>
                      ))
                    ) : (
                      <h3>Nie ma linków do kahutów, możesz je dodać</h3>
                    )}
                    <AddButton onClick={handleAddKahootLink}>
                      + Dodaj link
                    </AddButton>
                  </LinksContainer>

                  <AdminFormBtn
                    type="button"
                    onClick={handleSubmit}
                    style={{ marginTop: 'auto' }}
                  >
                    <FormBtnText>Zapisz</FormBtnText>
                  </AdminFormBtn>
                </>
              ) : (
                <h3>Wybierz kurs i grupę</h3>
              )}
            </div>
          </>
        )}

        {isLoading && <Loader />}
      </AdminPanelSection>
    </>
  );
};

export default KahootAdminPanel;
