import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import { WindowedChat } from 'utils/Chat/ChatWindowed/WindowedChat';
import { Loader } from './SharedLayout/Loaders/Loader';
// import StreamToZoomRedirecter from './StreamToZoomRedirecter/StreamToZoomRedirecter';
import TestChatBot from 'pages/Streams/TestChatBot/TestChatBot';

const Streams = lazy(() =>
  import(/* webpackChunkName: "Streams page" */ '../pages/Streams/Streams')
);

//eslint-disable-next-line
const Stream = lazy(() =>
  import(/* webpackChunkName: "Stream page" */ '../pages/Streams/Stream/Stream')
);

const Teacher = lazy(() =>
  import(/* webpackChunkName: "Teacher page" */ '../pages/TeacherPage/Teacher')
);

const TeacherPage = lazy(() =>
  import(
    /* webpackChunkName: "Teacher page" */ '../pages/TeacherPage/TeacherPage'
  )
);

const TeacherMain = lazy(() =>
  import(
    /* webpackChunkName: "Teacher page" */ '../pages/TeacherMain/TeacherMain'
  )
);

const TeacherPageFeedback = lazy(() =>
  import(
    /* webpackChunkName: "Teacher page" */ '../pages/TeacherPage/TeacherPageFeedback'
  )
);

const TeacherAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Teacher page" */ '../pages/AdminPanel/TeacherAdminPanel'
  )
);

const KahootAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Teacher page" */ '../pages/AdminPanel/KahootAdminPanel'
  )
);

const HostKahootAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Teacher page" */ '../pages/AdminPanel/HostKahootAdminPanel'
  )
);

const PointsAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Points page" */ '../pages/AdminPanel/PointsAdminPanel'
  )
);

const MyPedagogium = lazy(() =>
  import(
    /* webpackChunkName: "My Pedagogium Page" */ '../pages/MyPedagogium/MyPedagogium'
  )
);

const CourseAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Pedagogium Courses Admin Panel page" */ '../pages/Streams/CourseAdminPanel/CourseAdminPanel'
  )
);

const UniUserAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Pedagogium Users Admin Panel page" */ '../pages/Streams/UserAdminPanel/UniUserAdminPanel'
  )
);

const UserAttendanceAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "Pedagogium Users Admin Panel page" */ '../pages/Streams/UserAdminPanel/UserAttendanceAdminPanel'
  )
);

const TimeTableAdminPanel = lazy(() =>
  import(
    /* webpackChunkName: "TimeTable Admin Panel page" */ '../pages/Streams/TimeTableAdminPanel/TimeTableAdminPanel'
  )
);

const NotFound = lazy(() =>
  import(/* webpackChunkName: "Not Found" */ '../pages/NotFound/NotFound')
);

export const App = () => {
  return (
    <>
      <Toaster
        containerStyle={{
          top: '10%',
        }}
      />
      <Suspense fallback={Loader} noindex={true}>
        <Routes noindex={true}>
          <Route
            index
            path="/"
            element={<MyPedagogium />}
            noindex={true}
          ></Route>
          <Route
            path="admin"
            element={<CourseAdminPanel uni={'PEDAGOGIUM'} lang={'pl'} />}
            noindex={true}
          />
          <Route
            path="admin-users"
            element={<UniUserAdminPanel uni={'PEDAGOGIUM'} lang={'pl'} />}
            noindex={true}
          />
          <Route
            path="admin-attendance-users"
            element={
              <UserAttendanceAdminPanel uni={'PEDAGOGIUM'} lang={'pl'} />
            }
            noindex={true}
          />
          <Route
            path="admin-teacher"
            element={<TeacherAdminPanel />}
            noindex={true}
          />
          <Route
            path="admin-timetable"
            element={<TimeTableAdminPanel uni={'PEDAGOGIUM'} lang={'pl'} />}
            noindex={true}
          />
          <Route
            path="admin-kahoots"
            element={<KahootAdminPanel />}
            noindex={true}
          />

          <Route
            path="admin-host-kahoots"
            element={<HostKahootAdminPanel />}
            noindex={true}
          />

          <Route
            path="admin-points"
            element={<PointsAdminPanel />}
            noindex={true}
          />

          <Route path="*" element={<NotFound />} noindex={true} />

          <Route path="teacher-main" element={<TeacherMain />} noindex={true} />

          <Route
            path="teacher-feedback"
            element={<TeacherPageFeedback />}
            noindex={true}
          />

          <Route path="teacher" element={<Teacher />} noindex={true}>
            <Route path=":group" element={<TeacherPage />} noindex={true} />
          </Route>

          <Route path="lesson" element={<Streams />} noindex={true}>
            <Route path=":group" element={<Stream />} noindex={true} />
          </Route>

          <Route path="chat" element={<Streams />} noindex={true}>
            <Route path=":group" element={<WindowedChat />} noindex={true} />
          </Route>

          <Route path="chatbot" element={<TestChatBot />} noindex={true} />
        </Routes>
      </Suspense>
    </>
  );
};
