import "./courseDetails.scss";
import {useNavigate, useParams} from "react-router-dom";
import resultSrc from "../../../assets/result.svg";
import {HandySvg} from "handy-svg";
import CourseListItem from "./item/courseListItem";
import {useEffect, useState} from "react";
import {useHttp} from "../../../hooks/http.hook";
import {Oval} from "react-loader-spinner";
import courses from "../courses";
import {withErrorBoundary} from "react-use-error-boundary";
import {useSelector} from "react-redux";
const CourseDetails = withErrorBoundary(() =>{
    const {GET} = useHttp();
        const user = useSelector(state => state.users.user);
    const {courseId} = useParams();
    const [course, setCourse] = useState();
    const [teacher, setTeacher] = useState()
    const [teacherName, setTeacherName] = useState()
    const [Loading, setLoading] = useState(true)
    const [Tasks, setTasks] = useState();
    const [Marks, setMarks] = useState();
    const [Result, setResult] = useState()
    const navigate = useNavigate();
    useEffect(() => {
        getCourseData(courseId)
    }, []);
    const getCourseData = (courseId)=>{
        GET({},`courseresource/courses/${courseId}`,{Authorization:localStorage.getItem("jwt")})
            .then((res)=>{
                setCourse(res.data)
                GET({},"userdataresource/users/"+res.data.teacherId,{Authorization:localStorage.getItem("jwt")})
                    .then((result)=>{
                        const authorFullName = result.data.firstName + " " + result.data.lastName;
                        setTeacherName(authorFullName);
                        setTeacher(result.data)

                        GET({eduCourseId:res.data.id},"taskresource/tasks/by/course",{Authorization:localStorage.getItem("jwt")})
                            .then((spacite)=>{
                                    setTasks(spacite.data);
                                    GET({},`taskresource/taskResult/by/user?userId=${user.id}`,{Authorization:localStorage.getItem("jwt")})
                                        .then((taskResuslts)=>{
                                            setResult(taskResuslts.data);
                                            GET({},`taskresource/marks/by/user/${user.id}`,{Authorization:localStorage.getItem("jwt")})
                                                .then((marks)=>{
                                                    setMarks(marks.data);
                                                    setLoading(false)
                                                })
                                        })
                            })
                    });
            }).catch((err)=>{
                console.log(err)
                if (err.response.status===404){
                    navigate("/**")
                }
        });
    }
    const renderItems = arr =>{
        const items = arr.map((item, i) => {
            return(
                <CourseListItem mark={Marks[i]} testId={Tasks[i].testId} task={Tasks[i]} taskId={Tasks[i].id}/>
            )
        })
        return <>
            <div className="class">
                <div className="class__details">
                    <div className="class__details__header">
                        <div className="class__details__header__info">
                            <h1>{course.name}</h1>
                            <h3>{teacherName}</h3>
                        </div>
                        {/*<div className="class__details__header__details">*/}
                        {/*        <div className="class__details__header__details__content">*/}
                        {/*            <div className="class__details__header__details__content__header">Your current mark</div>*/}
                        {/*            <div className="class__details__header__details__content__mark">19/60</div>*/}
                        {/*        </div>*/}
                        {/*        <div className="class__details__header__details__icon">*/}
                        {/*            <div className="class__details__header__details__icon__svg">*/}
                        {/*                <HandySvg src={resultSrc} courseName="svg"/>*/}
                        {/*            </div>*/}

                        {/*        </div>*/}


                        {/*</div>*/}
                    </div>
                    <div className="class__details__content">
                        <div className="class__details__content__list">
                            <div className="class__details__content__list__header">Tasks</div>
                            <div className="class__details__content__list__content">
                                {items}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
    return(
        <>{Loading ? <div className="oval__loader"><Oval
            visible={true}
            height="120"
            width="120"
            color="#D90429"
            secondaryColor="#2B2D42"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
        /></div> :renderItems(Tasks)}</>

    )
}
)
export default CourseDetails;