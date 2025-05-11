import "./header.scss";
import {HandySvg} from "handy-svg";
import homeSrc from "../../assets/home.svg"
import courseSrc from "../../assets/courses.svg"
import scheduleSrc from "../../assets/schedule.svg"
import settingsSrc from "../../assets/settings.svg"
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {use, useEffect, useState} from "react";
import AuthChecker from "../shared/authChecker";
import { motion } from "framer-motion";
import {setUser} from "../../slices/userSlice";
import {useHttp} from "../../hooks/http.hook";
import {Oval} from "react-loader-spinner";
const Header = () => {
    const user = useSelector(state => state.users.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {GET} = useHttp()
    const [Loading, setLoading] = useState(true)


    useEffect(()=>{
        if (user==null || Object.keys(user).length == 0){
            GET(null,"authresource/auth/login")
                .then((res)=>{
                    dispatch(setUser(res.data))
                    setLoading(false);
                }).catch((err)=>{
                    console.log(err);
                navigate("/login");
            })
        }else {
            setLoading(false);
        }
    },[user]);
    const checkUserAuthority = () =>{
        if (user.roles.includes("TEACHER")||user.roles.includes("ADMIN")){
            return <NavLink to={"/admin"} className={({isActive})=> isActive ? "header__nav__item active" : "header__nav__item" }><a href=""><HandySvg src={settingsSrc} className="svg" /></a></NavLink>;
        }

    }
    const renderElement = () =>{
        return <>
            <motion.div
                className="header__avatar"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <img src={user.imageUrl} alt="user avatar" />
            </motion.div>

            <motion.nav
                className="header__nav"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'tween', duration: 0.6 }}
            >
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "header__nav__item active" : "header__nav__item"
                    }
                >
                    <HandySvg src={homeSrc} className="svg" />
                </NavLink>
                <NavLink
                    to="/courses"
                    className={({ isActive }) =>
                        isActive ? "header__nav__item active" : "header__nav__item"
                    }
                >
                    <HandySvg src={courseSrc} className="svg" />
                </NavLink>
                <NavLink
                    to="/schedule"
                    className={({ isActive }) =>
                        isActive ? "header__nav__item active" : "header__nav__item"
                    }
                >
                    <HandySvg src={scheduleSrc} className="svg" />
                </NavLink>
                {checkUserAuthority()}
            </motion.nav>
        </>
    }
    return(
        <div className="header">
            <header>
                {Loading ?<Oval
                    visible={true}
                    height="75"
                    width="75"
                    color="#D90429"
                    secondaryColor="#2B2D42"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                /> : renderElement()}

            </header>

        </div>
    )
}
export default Header;