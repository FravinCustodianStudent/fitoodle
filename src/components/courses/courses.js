import courseSrc from "../../assets/course.svg";
import "./courses.scss";
import {HandySvg} from "handy-svg";
import Course from "./course/course";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useHttp} from "../../hooks/http.hook";
import {Link} from "react-router-dom";
import {Oval} from "react-loader-spinner";
import {withErrorBoundary} from "react-use-error-boundary";
const Courses = withErrorBoundary(() =>{
    const {GET} = useHttp();
    const user = useSelector(state => state.users.user);
    const [Courses, setCourses] = useState()
    const [Loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    useEffect(()=>{
        if (!error) GetCourses();

    },[user,error]);
    const GetCourses=()=>{
        if (Object.keys(user).length!==0){
            GET({studentId:user.id},"userdataresource/groups/by-student",{})
                .then((res)=>{
                    console.log(res);
                    GET({groupId:res.data.id},"courseresource/courses/by/group",{})
                        .then((result)=>{
                            setCourses(result.data)
                            console.log(Courses)
                            setLoading(false)
                        })


                }).catch((err)=>{
                    console.log(err)
                setLoading(false);
                    setError(true)
            })
        }

    }
    const renderItems = arr =>{
        let items;
        if (!error){
            items = arr.map((item, i) => {
                return(
                    <Course id={Courses[i].id} nameOfCourse={Courses[i].name} idOfTeacher={Courses[i].teacherId} />
                )
            })
        }

        return <>
            <div className="courses__name">
                <h1>
                    Ваші курси, <Link to="/">{user.firstName+ " "+user.lastName}</Link>
                </h1>
            </div>
            <div className="courses__content">
                <div className="courses__content__cousrses">
                    <div className="courses__content__cousrses__name">Курси <HandySvg src={courseSrc} courseName="svg"/></div>
                    <div className="courses__content__cousrses__list">
                        {!error? items:"курсів немає"}
                    </div>


                </div>
            </div>
        </>
    }
    return (
        <div className="courses">
            {Loading ? <div className="oval__loader"><Oval
                visible={true}
                height="120"
                width="120"
                color="#D90429"
                secondaryColor="#2B2D42"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            /></div> :renderItems(Courses)}
        </div>
    )
})
export default Courses;