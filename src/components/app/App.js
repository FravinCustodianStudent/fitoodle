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
import LoginTestOpen from "../login/LoginTestOpen";

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
            path:'/courses/task/test/:testId',
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
            path:'/courses/task/test/:testId/:questionId',
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
    {path:"/testopen",Component:LoginTestOpen}
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
