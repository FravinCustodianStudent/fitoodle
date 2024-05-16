import "./task.scss";
import {HandySvg} from "handy-svg";
import arrowSrc from "../../../assets/arrow.svg";
const Task = () =>{
    return(
        <div className="task">
            <div className="task__info">
                <div className="task__info__status"></div>
                <div className="task__info__name">
                    <div className="task__info__name__task">Lorem ipsum dolor sit amet consectetur</div>
                    <div className="task__info__name__teacher">Stuart Koepp</div>
                </div>
            </div>
            <div className="task__action">
                <div className="task__action__dates">
                    <div className="task__action__dates__from">
                        <div className="task__action__dates__from__name">Дата створення</div>
                        <div className="task__action__dates__from__separator"></div>
                        <div className="task__action__dates__from__content">22.1.2022</div>
                    </div>
                    <div className="task__action__dates__to">
                        <div className="task__action__dates__to__name">Дата здачі</div>
                        <div className="task__action__dates__to__separator"></div>
                        <div className="task__action__dates__to__content">24.1.2022</div>
                    </div>
                </div>
                <a href=""><div className="task__action__button"><HandySvg src={arrowSrc}/></div></a>

            </div>
        </div>
    )
}

export default Task;