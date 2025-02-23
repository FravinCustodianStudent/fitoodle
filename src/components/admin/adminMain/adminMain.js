import "./adminMain.scss"
import settingsSrc from "../../../assets/settings.svg";
import {HandySvg} from "handy-svg";
import {Link} from "react-router-dom";

//https://codepen.io/NielsVoogt/pen/eYBQpPR
const AdminMain = () =>{
    return(<div className="Admin__main">
        <div className="Admin__main__list">
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    Групи
                </div>
               <Link to="testResult">
                   <div className="Admin__main__list__item__button">
                       <HandySvg src={settingsSrc} className="svg" />
                   </div>
               </Link>
            </div>
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    Курси
                </div>
                <Link to="courses">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    Tasks
                </div>
                <Link to="tasks">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    QuestionGroup
                </div>
                <Link to="questiongroup">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    TestConfigs
                </div>
                <Link to="testconfig">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    Питання
                </div>
                <Link to="questions">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    Розклад
                </div>
                <Link to="schedule">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
        </div>
    </div>)
}

export default AdminMain;