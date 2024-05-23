import "./schedule.scss";
import infoSrc from "../../assets/info.svg";
import {HandySvg} from "handy-svg";
import DayDate from "./date/dayDate";
import ScheduleTask from "./scheduleTask/scheduleTask";

const Schedule = () =>{
    return (
        <div className="schedule">
            <div className="schedule__header">
                <div className="schedule__header__name">
                    Розклад/<span>Жовтень 2023</span>
                </div>
                <div className="schedule__header__buttons">
                    <div className="schedule__header__buttons__left">
                        <HandySvg src={infoSrc}/>
                    </div>
                    <div className="schedule__header__buttons__right">
                        <HandySvg src={infoSrc}/>
                    </div>
                </div>
            </div>
            <div className="schedule__content">
                <div className="schedule__content__timer">
                    <div className="schedule__content__time">
                        9.00 - 10.20
                    </div>

                </div>
                <div className="schedule__content__desk">
                    <div className="schedule__content__desk__header">
                        <DayDate date="17" day="Понеділок" active={true} />
                        <DayDate date="18" day="Вівторок" />
                        <DayDate date="19" day="Середа" />
                        <DayDate date="20" day="Четверг" />
                        <DayDate date="21" day="П’ятниця" />
                        <DayDate date="22" day="субота" />
                    </div>
                    <div className="schedule__content__desk__row">
                        <ScheduleTask typeOfTask="task" today={true}/>
                        <ScheduleTask typeOfTask="task"/>
                        <ScheduleTask/>
                        <ScheduleTask typeOfTask="task"/>
                        <ScheduleTask/>
                        <ScheduleTask typeOfTask="space"/>
                    </div>
                    <div className="schedule__content__desk__row">
                        <ScheduleTask/>
                        <ScheduleTask typeOfTask="task" importance={true}/>
                        <ScheduleTask/>
                        <ScheduleTask/>
                        <ScheduleTask typeOfTask="task"/>
                        <ScheduleTask/>
                    </div>
                    <div className="schedule__content__desk__row">
                        <ScheduleTask typeOfTask="task" today={true} importance={true}/>
                        <ScheduleTask />
                        <ScheduleTask typeOfTask="task"/>
                        <ScheduleTask typeOfTask="task"/>
                        <ScheduleTask/>
                        <ScheduleTask/>
                    </div>
                    <div className="schedule__content__desk__row">
                        <ScheduleTask/>
                        <ScheduleTask typeOfTask="task" />
                        <ScheduleTask/>
                        <ScheduleTask/>
                        <ScheduleTask typeOfTask="task"/>
                        <ScheduleTask/>
                    </div>
                </div>
            </div>

    </div>
    )
}
export default Schedule;
