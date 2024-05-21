import '../../styles/App.scss';
import {createBrowserRouter, Route, Router, RouterProvider} from "react-router-dom";
import Login from "../login/login";
import Code from "../login/code";
import Layout from "../layout/Layout";
import Main from "../main/Main";
import Courses from "../courses/courses";
import Schedule from "../schedule/schedule";
import Settings from "../settings/settings";
import CourseDetails from "../courses/courseDetails/courseDetails";

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
            element: <Courses/>
        },
        {
            path:'/courses/:courseId',
            element: <CourseDetails/>
        }
        ,
        {
            path:'/schedule',
            element: <Schedule/>
        }
        ,
        {
            path:'/settings',
            element: <Settings/>
        }
    ]},
    {path:"/login",Component:Login},
    {path:"/code",Component:Code}
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
