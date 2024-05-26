import "./header.scss";
import {HandySvg} from "handy-svg";
import homeSrc from "../../assets/home.svg"
import courseSrc from "../../assets/courses.svg"
import scheduleSrc from "../../assets/schedule.svg"
import settingsSrc from "../../assets/settings.svg"
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import AuthChecker from "../shared/authChecker";
import {setUser} from "../../slices/userSlice";
import {useHttp} from "../../hooks/http.hook";
const Header = () => {
    const user = useSelector(state => state.users.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {GET} = useHttp()



    useEffect(()=>{
        if (user==null || Object.keys(user).length == 0){
            const jwt = localStorage.getItem("jwt");
            if (jwt == null){
                navigate("/login");
            }else{
                GET(null,"authresource/auth/login",{"Authorization":jwt})
                    .then((res)=>{
                        localStorage.setItem("jwt",res.headers.authorization);
                        dispatch(setUser(res.data))
                    })
            }

        }
    },[user]);
    return(
        <div className="header">
            <header>
                <div className="header__avatar"><img src={user.profileIconUrl} alt="user avatar"/> </div>
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