import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  AddButton,
  AdminFormBtn,
  AdminPanelSection,
  DefaultInput,
  DeleteButton,
  KahootsAdminContainer,
  LinksContainer,
  SpeakingSelect,
} from './TeacherAdminPanel.styled';

axios.defaults.baseURL = 'https://ap-server-8qi1.onrender.com';
// axios.defaults.baseURL = 'http://localhost:3001';

const KahootAdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [links, setLinks] = useState([]);
  const [visibleGroupName, setVisibleGroupName] = useState('');

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
    await axios.patch(`/pedagogium-host-kahoots`, {
      group: links.group,
      links: links.links,
    });
  };

  useEffect(() => {
    const getCourses = async () => {
      const response = await axios.get('/pedagogium-courses/admin');

      setCourses(response.data);
    };

    getCourses();
  }, []);

  return (
    <AdminPanelSection>
      {courses.length && (
        <KahootsAdminContainer>
          <SpeakingSelect
            options={courses.map(course => ({
              label: course.courseName,
              value: course.slug,
            }))}
            placeholder="Course"
            onChange={handleSelectCourse}
          />
          <SpeakingSelect
            options={
              selectedCourse?.courseGroups?.map(group => ({
                label: group,
                value: group,
              })) || []
            }
            placeholder="Group"
            onChange={handleSelectGroup}
            isDisabled={!selectedCourse}
          />

          <AdminFormBtn type="button" onClick={handleFindKahoots}>
            Find
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
                <h3>There are no links, you can add them</h3>
              )}
              <AddButton onClick={handleAddKahootLink}>+</AddButton>
            </LinksContainer>

            <AdminFormBtn
              type="button"
              onClick={handleSubmit}
              style={{ marginTop: 'auto' }}
            >
              Save
            </AdminFormBtn>
          </>
        ) : (
          <h3>Select group and course</h3>
        )}
      </div>
    </AdminPanelSection>
  );
};

export default KahootAdminPanel;
