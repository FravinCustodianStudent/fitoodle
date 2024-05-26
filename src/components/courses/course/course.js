import {HandySvg} from "handy-svg";
import arrowSrc from "../../../assets/arrow.svg";
import accountSrc from "../../../assets/account.svg";
import "./course.scss";
import {useHttp} from "../../../hooks/http.hook";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
const Course = ({id,nameOfCourse,idOfTeacher}) =>{
    const {GET} = useHttp();
    const [teacher, setTeacher] = useState()
    useEffect(()=>{
        getTeacherName()
    },[])
    const getTeacherName = () =>{
        GET({},"userdataresource/users/"+idOfTeacher,{Authorization:localStorage.getItem("jwt")})
            .then((res)=>{
                const authorFullName = res.data.firstName + " " + res.data.lastName;
                setTeacher(authorFullName)
            });
    }
    return(
        <div className="course">
            <div className="course__info">
                <div className="course__info__name">{nameOfCourse}</div>
                <div className="course__info__teacher">
                    <HandySvg src={accountSrc}/> {teacher}
                </div>
            </div>
            <Link to={`/courses/${id}`}><div className="course__button"><HandySvg src={arrowSrc}/></div></Link>
        </div>
    )
}

export default Course;
