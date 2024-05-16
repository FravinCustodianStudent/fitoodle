import courseSrc from "../../assets/course.svg";
import "./courses.scss";
import {HandySvg} from "handy-svg";
import Course from "./course/course";
const Courses = () =>{
    return (
        <div className="courses">
            <div className="courses__name">
                <h1>
                    Ваші курси, <a href="">USERNAME</a>
                </h1>
            </div>
            <div className="courses__content">
                <div className="courses__content__cousrses">
                    <div className="courses__content__cousrses__name">Курси <HandySvg src={courseSrc} courseName="svg"/></div>
                    <div className="courses__content__cousrses__list">
                    <Course/>
                </div>


                </div>
            </div>
        </div>
    )
}
export default Courses;