import "./courseDetails.scss";
import {useParams} from "react-router-dom";
import resultSrc from "../../../assets/result.svg";
import {HandySvg} from "handy-svg";
import CourseListItem from "./item/courseListItem";
const CourseDetails = () =>{
    let {courseId} = useParams();
    return(
        <div className="class">
            <div className="class__details">
                <div className="class__details__header">
                    <div className="class__details__header__info">
                        <h1>Lorem ipsum dolor sit amet consectetur.</h1>
                        <h3>Прокопенко Максим Васильович</h3>
                    </div>
                    <div className="class__details__header__details">
                            <div className="class__details__header__details__content">
                                <div className="class__details__header__details__content__header">Your current mark</div>
                                <div className="class__details__header__details__content__mark">19/60</div>
                            </div>
                            <div className="class__details__header__details__icon">
                                <div className="class__details__header__details__icon__svg">
                                    <HandySvg src={resultSrc} courseName="svg"/>
                                </div>

                            </div>


                    </div>
                </div>
                <div className="class__details__content">
                    <div className="class__details__content__list">
                    <div className="class__details__content__list__header">Tasks</div>
                        <div className="class__details__content__list__content">
                            <CourseListItem></CourseListItem>
                            <CourseListItem></CourseListItem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetails;