import {HandySvg} from "handy-svg";
import arrowSrc from "../../../assets/arrow.svg";
import accountSrc from "../../../assets/account.svg";
import "./course.scss";
import {useHttp} from "../../../hooks/http.hook";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import { motion } from "framer-motion";
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
    return (
        <motion.div className="course"
                    key={id}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: "spring", stiffness: 100 }}>
            <div className="course__info">
                <div className="course__info__name">{nameOfCourse}</div>
                <div className="course__info__teacher">
                    <HandySvg src={accountSrc} /> {teacher}
                </div>
            </div>
            <Link to={`/courses/${id}`}>
                <div className="course__button">
                    <HandySvg src={arrowSrc} />
                </div>
            </Link>
        </motion.div>
    );
}

export default Course;
