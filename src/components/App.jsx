import { CollectionsAdminPanel } from 'pages/Streams/CollectionsAdminPanel/CollectionsAdminPanel';
import { LessonsAdminPanel } from 'pages/Streams/LessonsAdminPanel/LessonsAdminPanel';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import { WindowedChat } from 'utils/Chat/ChatWindowed/WindowedChat';
import ScrollToTop from 'utils/ScrollToTop/ScrollToTop';
import { Loader } from './SharedLayout/Loaders/Loader';

const Streams = lazy(() =>
  import(/* webpackChunkName: "Streams page" */ '../pages/Streams/Streams')
);
const StreamA0 = lazy(() =>
  import(
    /* webpackChunkName: "Streams A0 page" */ '../pages/Streams/A0/StreamA0'
  )
);
const Teacher = lazy(() =>
  import(/* webpackChunkName: "Teacher layout" */ '../pages/Teacher/Teacher')
);

const AdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Links Admin Panel page" */ '../pages/Streams/AdminPanel/AdminPanel'
  )
);
const UserAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "User Admin Panel page" */ '../pages/Streams/UserAdminPanel/UserAdminPanel'
  )
);
const TeacherAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Teacher Admin Panel page" */ '../pages/Streams/TeacherAdminPanel/TeacherAdminPanel'
  )
);

const UserJsonPanel = lazy(() =>
  import(
    /* webpackChunkName: "User Json Panel page" */ '../pages/Streams/UserAdminPanel/UserJsonPanel'
  )
);
const RatingsAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Ratings Admin Panel page" */ '../pages/Streams/RatingsAdminPanel/RatingsAdminPanel'
  )
);
const TimeTableAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "TimeTable Admin Panel page" */ '../pages/Streams/TimeTableAdminPanel/TimeTableAdminPanel'
  )
);

const TeacherPage = lazy(() =>
  import(
    /* webpackChunkName: "Teacher Page" */ '../pages/TeacherPage/TeacherPage'
  )
);

const MyAP = lazy(() =>
  import(/* webpackChunkName: "My AP Page" */ '../pages/MyAP/MyAP')
);

const NotFound = lazy(() =>
  import(/* webpackChunkName: "Not Found" */ '../pages/NotFound/NotFound')
);

export const App = () => {
  return (
    <>
      <ScrollToTop />
      <Toaster
        containerStyle={{
          top: '10%',
        }}
      />
      <Suspense fallback={Loader}>
        <Routes>
          <Route path="/" element={<Streams />}>
            <Route path="a0" element={<StreamA0 />} />
            <Route path="*" element={<NotFound />} noindex={true} />
          </Route>
          <Route path="my-ap" element={<MyAP />} noindex={true} />
          <Route path="streams" element={<Streams />} noindex={true}>
            <Route path="a0-chat" element={<WindowedChat />} />
            <Route path="stream-admin-panel" element={<AdminPanel />} />
            <Route path="user-admin-panel" element={<UserAdminPanel />} />
            <Route
              path="teacher-teamlead-panel"
              element={<TeacherAdminPanel />}
            />
            <Route path="user-json-panel" element={<UserJsonPanel />} />
            <Route path="ratings-admin-panel" element={<RatingsAdminPanel />} />
            <Route path="lessons-admin-panel" element={<LessonsAdminPanel />} />
            <Route
              path="timetable-admin-panel"
              element={<TimeTableAdminPanel />}
            />
            <Route
              path="collection-admin-panel"
              element={<CollectionsAdminPanel />}
            />
          </Route>
          <Route path="teacher" element={<Teacher />} noindex={true}>
            <Route path="a0" element={<TeacherPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};
