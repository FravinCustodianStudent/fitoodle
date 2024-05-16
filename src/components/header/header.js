import "./header.scss";
import {HandySvg} from "handy-svg";
import homeSrc from "../../assets/home.svg"
import courseSrc from "../../assets/courses.svg"
import scheduleSrc from "../../assets/schedule.svg"
import settingsSrc from "../../assets/settings.svg"
import {NavLink} from "react-router-dom";
const Header = () => {
    return(
        <div className="header">
            <header>
                <div className="header__avatar">ava</div>
                <nav className="header__nav">
                    <NavLink to={"/"} className={({isActive})=> isActive ? "header__nav__item active" : "header__nav__item" }><a href=""><HandySvg src={homeSrc} className="svg" /></a></NavLink>
                    <NavLink to={"/courses"} className={({isActive})=> isActive ? "header__nav__item active" : "header__nav__item" }><a href=""><HandySvg src={courseSrc} className="svg" /></a></NavLink>
                    <NavLink to={"/schedule"} className={({isActive})=> isActive ? "header__nav__item active" : "header__nav__item" }><a href=""><HandySvg src={scheduleSrc} className="svg" /></a></NavLink>
                    <NavLink to={"/settings"} className={({isActive})=> isActive ? "header__nav__item active" : "header__nav__item" }><a href=""><HandySvg src={settingsSrc} className="svg" /></a></NavLink>
                </nav>
            </header>

        </div>
    )
}
export default Header;