import "./courseListItem.scss";
import {HandySvg} from "handy-svg";
import accountSrc from "../../../../assets/account.svg";
import labSrc from "../../../../assets/lab.svg";
import {FileDoneOutlined, LoadingOutlined} from "@ant-design/icons";
import arrowSrc from   "../../../../assets/arrow.svg"
import {useHttp} from "../../../../hooks/http.hook";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Spin} from "antd";
const CourseListItem = ({task,mark,testId,taskId}) =>{
    const [teacherFullName, setTeacherFullName] = useState();
    const {GET} = useHttp();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        console.log(testId);
        GET({},"userdataresource/users/"+task.authorId,{})
            .then((result)=>{
                const authorFullName = result.data.firstName + " " + result.data.lastName;
                setTeacherFullName(authorFullName);
                setLoading(false);
            })
    }, []);

    return<>
    {loading?<><Spin indicator={<LoadingOutlined spin />} size="large" /></> :
        <div className={task.testId?"class__details__content__list__content__item test" :"class__details__content__list__content__item"}>
        <div className="class__details__content__list__content__item__container">
            <div className="class__details__content__list__content__item__container__header">
                <div className="class__details__content__list__content__item__container__header__name">
                    <div className="class__details__content__list__content__item__container__header__name__icon">
                        {task.testId?<FileDoneOutlined />:<HandySvg src={labSrc}/>}

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
            {!taskId?<Link to={`/courses/task/${taskId}`}><div className="class__details__content__list__content__item__link__button"> <HandySvg src={arrowSrc}/></div></Link>:
                <Link to={`/courses/task/test/${taskId}/${testId}`}><div className="class__details__content__list__content__item__link__button"> <HandySvg src={arrowSrc}/></div></Link>}


        </div>
    </div>}
    </>
}
export default CourseListItem;