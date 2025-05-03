import "./scheduleTask.scss";
import {HandySvg} from "handy-svg";
import { motion } from "framer-motion";
import lectureSrc from "../../../assets/lecture.svg";
import resultSrc from "../../../assets/file.svg";
import peopleSrc from  "../../../assets/people.svg";
import arrowSrc from "../../../assets/arrow.svg";

const ScheduleTask = ({ typeOfTask, date, today, importance, practice }) => {
    function elementSwitcher() {
        switch(typeOfTask) {
            case "task":
                let type = "schedule__content__desk__row__item__task";
                if (today)     type += " active-schedule__task";
                if (importance) type += " importantTask";

                return (
                    <div className={type}>
                        <div className="schedule__content__desk__row__item__task__name">
                            {date.lectureName}
                        </div>
                        <div className="schedule__content__desk__row__item__task__teacher">
                            <div className="schedule__content__desk__row__item__task__teacher__icon">
                                <HandySvg src={peopleSrc}/>
                            </div>
                            <div className="schedule__content__desk__row__item__task__teacher__name">
                                {date.lecturerName}
                            </div>
                        </div>
                        <div className="schedule__content__desk__row__item__task__type">
                            <div className="schedule__content__desk__row__item__task__type__icon">
                                {practice
                                    ? <HandySvg src={resultSrc}/>
                                    : <HandySvg src={lectureSrc}/>
                                }
                            </div>
                            <div className="schedule__content__desk__row__item__task__type__name">
                                {practice ? "Практика" : "Лекція"}
                            </div>
                        </div>
                        <div className="schedule__content__desk__row__item__task__info">
                            <div className="schedule__content__desk__row__item__task__info__additional">
                            </div>
                            <a href={date.lectureLink}>
                                <motion.div
                                    className="schedule__content__desk__row__item__task__info__button"
                                    whileHover={{ scale: 1.3 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <HandySvg src={arrowSrc}/>
                                </motion.div>
                            </a>
                        </div>
                    </div>
                );

            case "space":
                return (
                    <div className="schedule__content__desk__row__item__holiday">
                        Вихідний
                    </div>
                );

            default:
                return <div className="schedule__content__desk__row__item__spacer"></div>;
        }
    }

    return (
        <motion.div
            className="schedule__content__desk__row__item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {elementSwitcher()}
        </motion.div>
    );
};

export default ScheduleTask;
