import "./courseDetails.scss";
import {useNavigate, useParams} from "react-router-dom";
import resultSrc from "../../../assets/result.svg";
import {HandySvg} from "handy-svg";
import CourseListItem from "./item/courseListItem";
import {useEffect, useState} from "react";
import {useHttp} from "../../../hooks/http.hook";
import {Oval} from "react-loader-spinner";
import courses from "../courses";
const CourseDetails = () =>{
    const {GET} = useHttp();
    const {courseId} = useParams();
    const [course, setCourse] = useState();
    const [teacher, setTeacher] = useState()
    const [teacherName, setTeacherName] = useState()
    const [Loading, setLoading] = useState(true)
    const [Tasks, setTasks] = useState()
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
                        setLoading(false)
                        GET({eduCourseId:res.data.id},"taskresource/tasks/by/course",{Authorization:localStorage.getItem("jwt")})
                            .then((spacite)=>{
                                    setTasks(spacite.data);
                            })
                    });
            });
    }
    //TODO пнуть Максима за говно на апи по таск резаоту
    const renderItems = arr =>{
        // const items = arr.map((item, i) => {
        //     return(
        //         <CourseListItem/>
        //     )
        // })
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
                                {/*{items}*/}
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

export default CourseDetails;