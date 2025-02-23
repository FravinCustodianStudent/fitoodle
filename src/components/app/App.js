import '../../styles/App.scss';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "../login/login";
import Code from "../login/code";
import Layout from "../layout/Layout";
import Main from "../main/Main";
import Courses from "../courses/courses";
import Schedule from "../schedule/schedule";
import Settings from "../settings/settings";
import CourseDetails from "../courses/courseDetails/courseDetails";
import Assignment from "../tasks/assignment";
import TestAssigment from "../tasks/testAssigment";
import TestPage from "../tests/testPage";
import ErrorBoundry from "../error/ErrorBoundry";
import LoginTest from "../login/loginTest";
import AdminPage from "../admin/adminPage";
import AdminMain from "../admin/adminMain/adminMain";
import AdminGroups from "../admin/groups/adminGroups";
import CoursesMain from "../admin/courses/coursesMain";
import TasksAdmin from "../admin/tasks/tasksAdmin";
import QuestionGroupAdmin from "../admin/tests/questionGroupAdmin";
import QuestionsAdmin from "../admin/tests/questionsAdmin";
import TestConfig from "../admin/tests/testConfig";
import ScheduleTask from "../schedule/scheduleTask/scheduleTask";
import ScheduleAdmin from "../admin/schedule/scheduleAdmin";
import TestResult from "../admin/testPanel/testResult/testResult";
// 3️⃣ Router singleton created
const router = createBrowserRouter([
    { path: "/", Component: Layout,
    children:[
        {
            path:'/',
            element: <Main/>,
        },


        {
            path:'/courses',
            element: <Courses/>,
        },
        {
            path:'/courses/:courseId',
            element: <CourseDetails/>,
        },
        {
            path:'/courses/task/:taskId',
            element: <Assignment/>,
        },
        {
            path:'/courses/task/test/:taskId/:testId',
            element: <TestAssigment/>,
        }
        ,
        {
            path:'/schedule',
            element: <Schedule/>,
        }
        ,
        {
            path:'/settings',
            element: <Settings/>,
        },
        {
            path:'/courses/task/test/:taskId/:testId/question',
            element: <TestPage/>,
        },
        {
            path:"*",
            element:<ErrorBoundry/>
        }
    ]},
    {path:"/login",Component:Login},
    {path:"/code",Component:Code},
    {path:"/test",Component:LoginTest},
    {path:"/admin",Component:AdminPage,
    children:[
        {
            path: '/admin',
            element: <AdminMain/>
        },
        {
            path: '/admin/groups',
            element: <AdminGroups/>
        },
        {
            path:'/admin/testResult',
            element: <TestResult/>
        },
        {
            path: '/admin/courses',
            element: <CoursesMain/>
        },
        {
            path: '/admin/tasks',
            element: <TasksAdmin/>
        },
        {
            path: '/admin/questiongroup',
            element: <QuestionGroupAdmin/>
        },
        {
            path: '/admin/questions',
            element: <QuestionsAdmin/>
        },
        {
            path: '/admin/testconfig',
            element: <TestConfig/>
        },
        {
            path: '/admin/schedule',
                element: <ScheduleAdmin/>
        }
    ]}
]);
function App() {
  return (
      <RouterProvider router={router}/>
      // <Router>
      // <div className="App">
      //     <Routes>
      //         <Route path='/' element={<Main/>}></Route>
      //         <Route path='/login' element={<Login/>}></Route>
      //         <Route path='/code' element={<Code/>}></Route>
      //     </Routes>
      // </div>
      // </Router>
  );
}
export default App;
