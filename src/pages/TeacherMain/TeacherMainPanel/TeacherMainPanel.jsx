import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  LogoutBtn,
  LogoutBtnIcon,
  LogoutPanel,
  PanelHideLeftSwitch,
  PanelHideRightSwitch,
  PanelHideSwitch,
  TeacherPanel,
} from '../../MyPedagogium/MyPedagogiumPanel/MyPedagogiumPanel.styled';
import {
  CourseList,
  CourseName,
  GroupLink,
  GroupLinkNumber,
  GroupsList,
  GroupsListItem,
} from '../TeacherMain.styled';

const TeacherAPPanel = ({ handleLogout }) => {
  const [isButtonBoxShown, setIsButtonBoxShown] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await axios.get('/pedagogium-courses/admin');
        setCourses(courses => (courses = [...res.data]));
      } catch (error) {}
    };
    getCourses();

    return () => {};
  }, []);

  const toggleButtonBox = () => {
    setIsButtonBoxShown(isShown => !isShown);
  };

  return (
    <>
      <PanelHideSwitch id="no-transform" onClick={toggleButtonBox}>
        {isButtonBoxShown ? <PanelHideRightSwitch /> : <PanelHideLeftSwitch />}
      </PanelHideSwitch>

      <LogoutPanel>
        <LogoutBtn onClick={handleLogout}>
          <LogoutBtnIcon />
          Log Out
        </LogoutBtn>
      </LogoutPanel>

      <TeacherPanel
        className={isButtonBoxShown ? '' : 'hidden'}
        style={{ top: '146px' }}
      >
        {courses.map(course => (
          <CourseList key={course._id}>
            <CourseName>{course.courseName}</CourseName>
            <GroupsList>
              {course.courseGroups.map((group, i) => (
                <GroupsListItem key={course._id + group}>
                  <GroupLink
                    to={`/teacher/${course.courseName
                      .split(' ')[0]
                      .toLowerCase()}${group === 1 ? '' : '_' + group}`}
                  >
                    <GroupLinkNumber>{group}</GroupLinkNumber>
                  </GroupLink>
                </GroupsListItem>
              ))}
            </GroupsList>
          </CourseList>
        ))}
      </TeacherPanel>
    </>
  );
};

export default TeacherAPPanel;
