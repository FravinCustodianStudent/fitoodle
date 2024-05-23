
import "./date.scss";

const DayDate = ({date,day,active}) =>{
    return(
        <div className={active?
            "schedule__content__desk__header__item activeScheduleItem" :
            "schedule__content__desk__header__item"}>
            <div className="schedule__content__desk__header__item__date">
                {date}
            </div>
            <div className="schedule__content__desk__header__item__day">
                {day}
            </div>
        </div>
    )
}

export default DayDate;