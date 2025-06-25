import axios from 'axios';
import { FormBtnText, Label } from 'components/LeadForm/LeadForm.styled';
import { Loader } from 'components/SharedLayout/Loaders/Loader';
import {
  BoxHideLeftSwitch,
  BoxHideRightSwitch,
  LoginLogo,
} from 'components/Stream/Stream.styled';
import { Formik } from 'formik';
import {
  AddButton,
  AdminButtonBoxSwitch,
  DefaultInput,
  DeleteButton,
  FormSelect,
  KahootLinkBox,
  KahootsAdminContainer,
  KahootsAdminForm,
  LinkArea,
  LinksContainer,
  NoLinksChosen,
  SubmitKahootsButton,
  VisibleGroupName,
} from 'pages/AdminPanel/TeacherAdminPanel.styled';
import { LoginErrorNote } from 'pages/MyPedagogium/MyPedagogiumPanel/MyPedagogiumPanel.styled';
import {
  AdminFormBtn,
  LoginForm,
} from 'pages/Streams/AdminPanel/AdminPanel.styled';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  PanelHeader,
  SubmitFormBtn,
} from '../Streams/CourseAdminPanel/CourseAdminPanel.styled';
import {
  AdminInput,
  AdminInputNote,
  AdminPanelSection,
} from '../Streams/UserAdminPanel/UserAdminPanel.styled';
import SideAdminMenu from './SideAdminMenu';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';

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
  const [isUserInfoIncorrect, setIsUserInfoIncorrect] = useState(false);
  const [customError, setCustomError] = useState('');

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
    const response = await axios.get(`/pedagogium-kahoots/${slug}`);

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
      await axios.patch(`/pedagogium-kahoots`, {
        group: links.group,
        links: links.links,
      });

      alert('Link został zapisany');
    } catch (e) {
      alert('Wystąpił błąd, spróbuj ponownie');
    }
  };

  useEffect(() => {
    document.title = 'Panel kahutów | Pedagogium';

    const refreshToken = async () => {
      
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
      <PanelHeader>Panel kahutów</PanelHeader>
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
                  placeholder={'Login'}
                  onBlur={() => setIsUserInfoIncorrect(false)}
                />
                <AdminInputNote component="p" name="login" />
              </Label>
              <Label>
                <AdminInput
                  type="password"
                  name="password"
                  placeholder={'Hasło'}
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
              currentPage={'admin-kahoots'}
            />
            <AdminButtonBoxSwitch id="no-transform" onClick={toggleButtonBox}>
              {isButtonBoxOpen ? <BoxHideLeftSwitch /> : <BoxHideRightSwitch />}
            </AdminButtonBoxSwitch>
            <KahootsAdminContainer>
              {courses.length && (
                <KahootsAdminForm>
                  <FormSelect
                    options={courses.map(course => ({
                      label: course.courseName,
                      value: course.slug,
                    }))}
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
                    onChange={handleSelectCourse}
                  />
                  <FormSelect
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
                    onChange={handleSelectGroup}
                    isDisabled={!selectedCourse}
                  />

                  <SubmitFormBtn type="button" onClick={handleFindKahoots}>
                    <FormBtnText>Szukaj</FormBtnText>
                  </SubmitFormBtn>
                  <LoginErrorNote>{customError}</LoginErrorNote>
                </KahootsAdminForm>
              )}
              <LinkArea>
                {links.group ? (
                  <>
                    <VisibleGroupName>{visibleGroupName}</VisibleGroupName>
                    <LinksContainer>
                      {links.links.length ? (
                        links.links.map((link, index) => (
                          <KahootLinkBox key={index}>
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
                              ✖ Usuń
                            </DeleteButton>
                          </KahootLinkBox>
                        ))
                      ) : (
                        <NoLinksChosen>
                          Nie dodano jeszcze linków do kahutów. Możesz je teraz
                          dodać
                        </NoLinksChosen>
                      )}
                      <AddButton onClick={handleAddKahootLink}>
                        🞣 Dodaj link
                      </AddButton>
                    </LinksContainer>

                    <SubmitKahootsButton
                      type="button"
                      onClick={handleSubmit}
                      style={{ marginTop: 'auto' }}
                    >
                      <FormBtnText>Zapisz</FormBtnText>
                    </SubmitKahootsButton>
                  </>
                ) : (
                  <NoLinksChosen>
                    Wybierz kurs i grupę w formularzu po lewej stronie
                  </NoLinksChosen>
                )}
              </LinkArea>
            </KahootsAdminContainer>
          </>
        )}

        {isLoading && <Loader />}
      </AdminPanelSection>
    </>
  );
};

export default KahootAdminPanel;
