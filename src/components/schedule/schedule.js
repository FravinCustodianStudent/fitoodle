import "./schedule.scss";
import { useHttp } from "../../hooks/http.hook";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import DayDate from "./date/dayDate";
import ScheduleTask from "./scheduleTask/scheduleTask";
import { motion } from "framer-motion";
const Schedule = () => {
    const [schedule, setSchedule] = useState([]);            // array of 6 day‐objects
    const [loading, setLoading] = useState(true);
    const { GET } = useHttp();
    const [teachers, setTeachers] = useState([])
    useEffect(() => {
        GET({}, 'userdataresource/users?active=true&roles=TEACHER', {})
            .then(res => setTeachers(res.data))
            .catch(console.error)
        GET({}, "scheduleresource/schedules/personal", {})
            .then(res => {
                // res.data.days is your array of 6 days
                setSchedule(res.data.days || []);
            })
            .finally(() => setLoading(false));
    }, []);
    // labels and dayOfWeek indices for your 6 columns
    const daysOfWeek = [
        { label: "Понеділок", dayOfWeek: 1 },
        { label: "Вівторок",  dayOfWeek: 2 },
        { label: "Середа",    dayOfWeek: 3 },
        { label: "Четверг",   dayOfWeek: 4 },
        { label: "П’ятниця",  dayOfWeek: 5 },
        { label: "Субота",    dayOfWeek: 6 },
    ];


    const weekDates = (() => {
        const curr = new Date();
        // treat Sunday (0) as day 7 so Monday → 1 … Saturday → 6
        const weekday = curr.getDay() === 0 ? 7 : curr.getDay();
        // days in current month
        const thisMonthDays = new Date(curr.getFullYear(), curr.getMonth() + 1, 0).getDate();
        // days in previous month
        const prevMonthDays = new Date(curr.getFullYear(), curr.getMonth(), 0).getDate();

        return Array.from({ length: 6 }, (_, i) => {
            // “raw” day number relative to Monday=1 … Saturday=6
            const raw = curr.getDate() - weekday + (i + 1);

            if (raw < 1) {
                // before the 1st → wrap into last days of prev month
                return prevMonthDays + raw;
            }
            if (raw > thisMonthDays) {
                // beyond end of month → wrap into next month
                return raw - thisMonthDays;
            }
            return raw;
        });
    })();

    // static array of your seven possible timeSlots
    const timeSlots = [1,2,3,4,5,6,7];

    if (loading) {
        return (
            <div className="oval__loader">
                <Oval
                    visible
                    height="120"
                    width="120"
                    color="#D90429"
                    secondaryColor="#2B2D42"
                    ariaLabel="oval-loading"
                />
            </div>
        );
    }

    return (
            <motion.div
      className="schedule"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="schedule__header">
                <div className="schedule__header__name">
                    Розклад/<span>{`${new Date().getMonth()+1}`.padStart(2,'0')}.{new Date().getFullYear()}</span>
                </div>
                <div className="schedule__header__buttons">
                    {/* your existing buttons here (commented out) */}
                </div>
            </div>

            <div className="schedule__content">
                <div className="schedule__content__timer">
                    <div className="schedule__content__timer__time">09.00 - 10.20</div>
                    <div className="schedule__content__timer__time">10.30 - 11.50</div>
                    <div className="schedule__content__timer__time">12.10 - 13.30</div>
                    <div className="schedule__content__timer__time">13.40 - 15.00</div>
                    <div className="schedule__content__timer__time">15.10 - 16.30</div>
                    <div className="schedule__content__timer__time">16.40 - 18.00</div>
                    <div className="schedule__content__timer__time">18.10 - 19.30</div>
                </div>

                <div className="schedule__content__desk">
                    <div className="schedule__content__desk__header">
                        {daysOfWeek.map((d, idx) => (
                            <DayDate
                                key={d.dayOfWeek}
                                date={weekDates[idx]}
                                day={d.label}
                                active={weekDates[idx] === new Date().getDate()}
                            />
                        ))}
                    </div>

                    {timeSlots.map(slot => (
                        <div className="schedule__content__desk__row" key={slot}>
                            {daysOfWeek.map(d => {
                                const dayData = schedule.find(x => x.dayOfWeek === d.dayOfWeek) || { lessons: [] };
                                const lesson = dayData.lessons.find(l => l.timeSlot === slot);
                                console.log(lesson);

                                const teacherObj = lesson?  teachers.find(t => t.id === lesson.teacher) : {};
                                const teacherName = teacherObj.firstName+" "+ teacherObj.lastName;

                                const isToday = new Date().getDay() === d.dayOfWeek;
                                if (!lesson) {
                                    if (slot===1 && dayData.lessons.length ===0) {
                                        return <ScheduleTask key={`${d.dayOfWeek}-${slot}`} typeOfTask="space" />;
                                    }else {
                                        return <ScheduleTask/>
                                    }

                                }else {
                                    return (
                                        <ScheduleTask
                                            key={lesson.id}
                                            date={{
                                                lectureName:   lesson.lectureName   || lesson.eduItem,
                                                lecturerName:  lesson.lecturerName  || teacherName,

                                                shared: lesson.shared,
                                                lectureLink:   lesson.lectureLink  || lesson.conferenceUrl
                                            }}
                                            practice={lesson.practice}
                                            typeOfTask="task"
                                            importance={lesson.importance}
                                            today={isToday}
                                        />
                                    );
                                }

                            })}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Schedule;
