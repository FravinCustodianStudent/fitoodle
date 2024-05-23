import "./scheduleTask.scss";
import {HandySvg} from "handy-svg";
import lectureSrc from "../../../assets/lecture.svg";
import peopleSrc from  "../../../assets/people.svg";
import arrowSrc from "../../../assets/arrow.svg";
const ScheduleTask = ({typeOfTask,date,today,importance}) =>{

    function elementSwitcher(){
        switch(typeOfTask){
            case "task":
                let type = "schedule__content__desk__row__item__task";
                if (today) type += " active-schedule__task";

                if (importance) type += type.concat(" importantTask");
                console.log(importance)
                console.log(type)
                return <div className={type}>
                    <div className="schedule__content__desk__row__item__task__name">
                        Математичні основи програмної інженерії
                    </div>
                    <div className="schedule__content__desk__row__item__task__teacher">
                        <div className="schedule__content__desk__row__item__task__teacher__icon">
                            <HandySvg src={peopleSrc}/>
                        </div>
                        <div className="schedule__content__desk__row__item__task__teacher__name">
                            Ткаченко М.В.
                        </div>
                    </div>
                    <div className="schedule__content__desk__row__item__task__type">
                        <div className="schedule__content__desk__row__item__task__type__icon">
                            <HandySvg src={lectureSrc}/>
                        </div>
                        <div className="schedule__content__desk__row__item__task__type__name">
                            Лекція
                        </div>
                    </div>
                    <div className="schedule__content__desk__row__item__task__info">
                        <div className="schedule__content__desk__row__item__task__info__additional">
                            До 23.05
                        </div>
                        <a href=""><div className="schedule__content__desk__row__item__task__info__button">
                            <HandySvg src={arrowSrc}/>
                        </div></a>

                    </div>
                </div>
                break;
            case "space":
                return        <div className="schedule__content__desk__row__item__holiday">
                    Вихідний
                </div>
                break;
            default:
                return <div className="schedule__content__desk__row__item__spacer"></div>;
        }

    }

    return(
        <div className="schedule__content__desk__row__item">
            {elementSwitcher()}
        </div>
    )
}

export default ScheduleTask;