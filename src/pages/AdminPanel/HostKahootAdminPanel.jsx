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
  SpeakingSelect,
} from './TeacherAdminPanel.styled';
import { Label } from 'components/LeadForm/LeadForm.styled';
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
  };

  const handleSelectGroup = item => {
    setSelectedGroup(item.value);
  };

  const handleFindKahoots = async () => {
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

              <AdminFormBtn type="button" onClick={handleFindKahoots}>
                Szukaj
              </AdminFormBtn>
            </KahootsAdminContainer>
          )}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              height: '100%',
              border: '1px solid gray',
              borderRadius: '25px',
              padding: '12px 4px 4px 4px',
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
                          ✖
                        </DeleteButton>
                      </div>
                    ))
                  ) : (
                    <h3>Nie ma linków do kahutów, możesz je dodać</h3>
                  )}
                  <AddButton onClick={handleAddKahootLink}>+</AddButton>
                </LinksContainer>

                <AdminFormBtn
                  type="button"
                  onClick={handleSubmit}
                  style={{ marginTop: 'auto' }}
                >
                  Zapisz
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
  );
};

export default KahootAdminPanel;
