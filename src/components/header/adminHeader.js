import {useDispatch, useSelector} from "react-redux";
import {NavLink, useNavigate} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {useEffect, useState} from "react";
import {setUser} from "../../slices/userSlice";
import {HandySvg} from "handy-svg";
import homeSrc from "../../assets/home.svg";
import {Oval} from "react-loader-spinner";
import courseSrc from "../../assets/courses.svg";
import scheduleSrc from "../../assets/schedule.svg";
import settingsSrc from "../../assets/settings.svg";


const AdminHeader = () =>{
    const user = useSelector(state => state.users.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {GET} = useHttp()
    const [Loading, setLoading] = useState(true)


    useEffect(()=>{
        if (user==null || Object.keys(user).length == 0){
            GET(null,"authresource/auth/login")
                .then((res)=>{
                    console.log(res)
                    dispatch(setUser(res.data))
                })
                .catch((err)=>{
                    navigate("/test");
                })

        }
        setLoading(false);

    },[user]);
    const renderElement = () =>{
        return <>
            <div className="header__avatar"><img src={user.imageUrl} alt="user avatar"/> </div>
            <nav className="header__nav">
                <NavLink to={"/admin"} className={({isActive})=> isActive ? "header__nav__item active" : "header__nav__item" }><a href=""><HandySvg src={homeSrc} className="svg" /></a></NavLink>
                <NavLink to={"/courses"} className={({isActive})=> isActive ? "header__nav__item active" : "header__nav__item" }><a href=""><HandySvg src={courseSrc} className="svg" /></a></NavLink>
                <NavLink to={"/schedule"} className={({isActive})=> isActive ? "header__nav__item active" : "header__nav__item" }><a href=""><HandySvg src={scheduleSrc} className="svg" /></a></NavLink>
                <NavLink to={"/settings"} className={({isActive})=> isActive ? "header__nav__item active" : "header__nav__item" }><a href=""><HandySvg src={settingsSrc} className="svg" /></a></NavLink>
            </nav>
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

export default AdminHeader;