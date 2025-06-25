import { LinkTo } from 'pages/Streams/CourseAdminPanel/CourseAdminPanel.styled';
import { AdminButtonBox } from './TeacherAdminPanel.styled';

const menuItems = [
  {
    slug: 'admin',
    label: 'Kursy',
  },
  {
    slug: 'admin-teacher',
    label: 'Nauczyciele',
  },
  {
    slug: 'admin-timetable',
    label: 'Harmonogramy',
  },
  {
    slug: 'admin-users',
    label: 'Studenci',
  },
  {
    slug: 'admin-kahoots',
    label: 'Kahooty',
  },
  {
    slug: 'admin-host-kahoots',
    label: 'Kahooty właściciela',
  },
  {
    slug: 'admin-points',
    label: 'Wyniki',
  },
];

const SideAdminMenu = ({ isOpen, currentPage }) => {
  return (
    <AdminButtonBox className={!isOpen ? 'hidden' : ''}>
      {menuItems.map(item => (
        <LinkTo
          key={item.slug}
          $isDisabled={currentPage === item.slug}
          to={`/${item.slug}`}
        >
          {item.label}
        </LinkTo>
      ))}
    </AdminButtonBox>
  );
};

export default SideAdminMenu;
