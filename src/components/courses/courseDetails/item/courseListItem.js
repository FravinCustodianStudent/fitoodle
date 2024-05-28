import "./courseListItem.scss";
import {HandySvg} from "handy-svg";
import accountSrc from "../../../../assets/account.svg";
import labSrc from "../../../../assets/lab.svg";
import arrowSrc from   "../../../../assets/arrow.svg"
import {useHttp} from "../../../../hooks/http.hook";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
const CourseListItem = ({task,mark,taskId}) =>{
    const [teacherFullName, setTeacherFullName] = useState();
    const {GET} = useHttp();
    useEffect(() => {
        console.log(task);
        console.log(mark);
        GET({},"userdataresource/users/"+task.authorId,{Authorization:localStorage.getItem("jwt")})
            .then((result)=>{
                const authorFullName = result.data.firstName + " " + result.data.lastName;
                setTeacherFullName(authorFullName);
            })
    }, []);

    return <div className="class__details__content__list__content__item">
        <div className="class__details__content__list__content__item__container">
            <div className="class__details__content__list__content__item__container__header">
                <div className="class__details__content__list__content__item__container__header__name">
                    <div className="class__details__content__list__content__item__container__header__name__icon">
                        <HandySvg src={labSrc}/>
                    </div>
                    <div className="class__details__content__list__content__item__container__header__name__content">{task.name}</div>
                </div>
                <div className="class__details__content__list__content__item__container__header__teacher">
                    <div className="class__details__content__list__content__item__container__header__teacher__icon">
                        <HandySvg src={accountSrc}/>
                    </div>
                    <div className="class__details__content__list__content__item__container__header__teacher__content">{teacherFullName}</div>
                </div>
            </div>
            <div className="class__details__content__list__content__item__container__text">
                {task.description}
            </div>
        </div>
        <div className="class__details__content__list__content__item__link">
            <div className="class__details__content__list__content__item__link__mark">{mark.markValue}/{task.maxMarkValue}</div>
            <Link to={`/courses/task/${taskId}`}><div className="class__details__content__list__content__item__link__button"> <HandySvg src={arrowSrc}/></div></Link>

        </div>
    </div>
}
export default CourseListItem;