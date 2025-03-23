import "./schedule.scss";
import infoSrc from "../../assets/info.svg";
import {HandySvg} from "handy-svg";
import DayDate from "./date/dayDate";
import ScheduleTask from "./scheduleTask/scheduleTask";
import {useHttp} from "../../hooks/http.hook";
import {useEffect, useState} from "react";
import {Oval} from "react-loader-spinner";

const Schedule = () =>{
    const [Schedule, setSchedule] = useState()
    const  {GET} = useHttp();
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        GET({},"scheduleresource/schedules/personal",{})
            .then((res)=>{
                //#Update schedule
                console.log(res.data);
                // setSchedule(res.data);
                // setLoading(false);
            })
        // getWeeksDates();
        // setInterval(setActiveTimer,1000);
    }, []);
    const getCurrentMothDate = () =>{
        const date = new Date();
        return `${date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1)}.${date.getFullYear()}`
    }
    const getDays = (year, month) => {
        return new Date(year, month, 0).getDate();
    };
    const getTodayDate = () =>{
        const today = new Date()
        return today.getDate();
    }
    const getWeeksDates = ()=>{
        const curr = new Date; // get current date
        const weeksOfDay = [];
        for (let i = 1; i < 7; i++) {
            let dateToPush = (curr.getDate() - curr.getDay()+i)>getDays(curr.getFullYear(),curr.getDate())?
                curr.getDate() - curr.getDay()+i-getDays(curr.getFullYear(),curr.getDate()):
                curr.getDate() - curr.getDay()+i;
            weeksOfDay.push(dateToPush) ; // First day is the day of the month - the day of the week
        }
        return weeksOfDay;

    }
    const scheduleAchiver = (date,dayNumber)=>{
        const today = new Date();
        if (date ===null || date.length===0) return <ScheduleTask/>
       return  today.getDay() === dayNumber ?  <ScheduleTask date={date} typeOfTask="task" today={true}/> : <ScheduleTask date={date} typeOfTask="task"/>

    }
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

// Функция для проверки, находится ли текущее время в указанном промежутке
    function isTimeInRange(time, start, end) {
        return time >= start && time <= end;
    }

// Функция для добавления класса "active-timer" к соответствующему времени
    function setActiveTimer() {
        const currentTime = getCurrentTime();
        const timeElements = document.querySelectorAll('.schedule__content__timer__time');
        timeElements.forEach(element => {
            const timeRange = element.innerText.trim().split(' - ');
            const startTime = timeRange[0];
            const endTime = timeRange[1];

            if (isTimeInRange(currentTime, startTime, endTime)) {
                element.classList.add('active-timer');
            } else {
                element.classList.remove('active-timer');
            }
        });
    }

    return (
        <>
            {Loading ?<div className="oval__loader"><Oval
                visible={true}
                height="120"
                width="120"
                color="#D90429"
                secondaryColor="#2B2D42"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            /></div> : <div className="schedule">
                <div className="schedule__header">
                    <div className="schedule__header__name">
                        Розклад/<span>{getCurrentMothDate()}</span>
                    </div>
                    <div className="schedule__header__buttons">
                        {/*<div className="schedule__header__buttons__left">*/}
                        {/*    <HandySvg src={infoSrc}/>*/}
                        {/*</div>*/}
                        {/*<div className="schedule__header__buttons__right">*/}
                        {/*    <HandySvg src={infoSrc}/>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="schedule__content">
                    <div className="schedule__content__timer">
                        <div className="schedule__content__timer__time">
                            09.00 - 10.20
                        </div>
                        <div className="schedule__content__timer__time">
                            10.30 - 11.50
                        </div>
                        <div className="schedule__content__timer__time">
                            12.10 - 13.30
                        </div>
                        <div className="schedule__content__timer__time">
                            13.40 - 15.00
                        </div>
                        <div className="schedule__content__timer__time">
                            15.10 - 16.30
                        </div>
                        <div className="schedule__content__timer__time">
                            16.40 - 18.00
                        </div>
                    </div>
                    <div className="schedule__content__desk">
                        <div className="schedule__content__desk__header">
                            <DayDate date={getWeeksDates()[0]} day="Понеділок" active={getWeeksDates()[0]===getTodayDate()} />
                            <DayDate date={getWeeksDates()[1]} day="Вівторок" active={getWeeksDates()[1]===getTodayDate()}/>
                            <DayDate date={getWeeksDates()[2]} day="Середа" active={getWeeksDates()[2]===getTodayDate()}/>
                            <DayDate date={getWeeksDates()[3]} day="Четверг" active={getWeeksDates()[3]===getTodayDate()}/>
                            <DayDate date={getWeeksDates()[4]} day="П’ятниця"active={getWeeksDates()[4]===getTodayDate()} />
                            <DayDate date={getWeeksDates()[5]} day="субота" active={getWeeksDates()[5]===getTodayDate()}/>
                        </div>
                        <div className="schedule__content__desk__row">
                            {scheduleAchiver(Schedule.monday.firstLesson,1)}
                            {scheduleAchiver(Schedule.tuesday.firstLesson,2)}
                            {scheduleAchiver(Schedule.wednesday.firstLesson,3)}
                            {scheduleAchiver(Schedule.thursday.firstLesson,4)}
                            {scheduleAchiver(Schedule.friday.firstLesson,5)}
                            <ScheduleTask typeOfTask={"space"}/>
                        </div>
                        <div className="schedule__content__desk__row">
                            {scheduleAchiver(Schedule.monday.secondLesson,1)}
                            {scheduleAchiver(Schedule.tuesday.secondLesson,2)}
                            {scheduleAchiver(Schedule.wednesday.secondLesson,3)}
                            {scheduleAchiver(Schedule.thursday.secondLesson,4)}
                            {scheduleAchiver(Schedule.friday.secondLesson,5)}
                            <ScheduleTask/>
                        </div>
                        <div className="schedule__content__desk__row">
                            {scheduleAchiver(Schedule.monday.thirdLesson,1)}
                            {scheduleAchiver(Schedule.tuesday.thirdLesson,2)}
                            {scheduleAchiver(Schedule.wednesday.thirdLesson,3)}
                            {scheduleAchiver(Schedule.thursday.thirdLesson,4)}
                            {scheduleAchiver(Schedule.friday.thirdLesson,5)}
                            <ScheduleTask/>
                        </div>
                        <div className="schedule__content__desk__row">
                            {scheduleAchiver(Schedule.monday.fourthLesson,1)}
                            {scheduleAchiver(Schedule.tuesday.fourthLesson,2)}
                            {scheduleAchiver(Schedule.wednesday.fourthLesson,3)}
                            {scheduleAchiver(Schedule.thursday.fourthLesson,4)}
                            {scheduleAchiver(Schedule.friday.fourthLesson,5)}
                            <ScheduleTask/>
                        </div>
                        <div className="schedule__content__desk__row">
                            {scheduleAchiver(Schedule.monday.sixthLesson,1)}
                            {scheduleAchiver(Schedule.tuesday.sixthLesson,2)}
                            {scheduleAchiver(Schedule.wednesday.sixthLesson,3)}
                            {scheduleAchiver(Schedule.thursday.sixthLesson,4)}
                            {scheduleAchiver(Schedule.friday.sixthLesson,5)}
                            <ScheduleTask/>
                        </div>
                        <div className="schedule__content__desk__row">
                            {scheduleAchiver(Schedule.monday.seventhLesson,1)}
                            {scheduleAchiver(Schedule.tuesday.seventhLesson,2)}
                            {scheduleAchiver(Schedule.wednesday.seventhLesson,3)}
                            {scheduleAchiver(Schedule.thursday.seventhLesson,4)}
                            {scheduleAchiver(Schedule.friday.seventhLesson,5)}
                            <ScheduleTask/>
                        </div>
                    </div>
                </div>

            </div>}
        </>

    )
}
export default Schedule;
