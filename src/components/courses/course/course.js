import {HandySvg} from "handy-svg";
import arrowSrc from "../../../assets/arrow.svg";
import accountSrc from "../../../assets/account.svg";
import "./course.scss";
const Course = () =>{

    return(
        <div className="course">
            <div className="course__info">
                <div className="course__info__name">Lorem ipsum dolor sit amet consectetur.</div>
                <div className="course__info__teacher">
                    <HandySvg src={accountSrc}/>  Прокопенко Максим Васильович
                </div>
            </div>
            <a href=""><div className="course__button"><HandySvg src={arrowSrc}/></div></a>
        </div>
    )
}

export default Course;
