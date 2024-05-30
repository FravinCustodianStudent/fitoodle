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
               <Link to="groups">
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
                    Групи
                </div>
                <Link to="groups">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    Групи
                </div>
                <Link to="groups">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    Групи
                </div>
                <Link to="groups">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
            <div className="Admin__main__list__item">
                <div className="Admin__main__list__item__name">
                    Групи
                </div>
                <Link to="groups">
                    <div className="Admin__main__list__item__button">
                        <HandySvg src={settingsSrc} className="svg" />
                    </div>
                </Link>
            </div>
        </div>
    </div>)
}

export default AdminMain;