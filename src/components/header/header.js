import "./header.scss";
import {HandySvg} from "handy-svg";
import homeSrc from "../../assets/home.svg"
import courseSrc from "../../assets/courses.svg"
import scheduleSrc from "../../assets/schedule.svg"
import settingsSrc from "../../assets/settings.svg"
const Header = () => {
    return(
        <div className="header">
            <header>
                <div className="header__avatar">ava</div>
                <nav className="header__nav">
                    <div className="header__nav__item active"><a href=""><HandySvg src={homeSrc} className="svg" /></a></div>
                    <div className="header__nav__item"><a href=""><HandySvg src={courseSrc} className="svg" /></a></div>
                    <div className="header__nav__item"><a href=""><HandySvg src={scheduleSrc} className="svg" /></a></div>
                    <div className="header__nav__item"><a href=""><HandySvg src={settingsSrc} className="svg" /></a></div>
                </nav>
            </header>

        </div>
    )
}
export default Header;