import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {useHttp} from "../../hooks/http.hook";
import "./login.scss";
import {setUser} from "../../slices/userSlice";
import {useDispatch} from "react-redux";
import "./code.scss"
import { motion, AnimatePresence } from 'framer-motion';
const Code = () => {

    const {Auth,GET} = useHttp();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const Login = (code) =>{
        Auth("auth/google/authentication",code)
            .then((res)=>{
                GET(null,"authresource/auth/login",{})
                    .then((res)=>{
                        console.log(res.data)
                        dispatch(setUser(res.data))
                        navigate("/")
                    })
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    useEffect(()=>{
      const code = searchParams.get("code");
      Login(code);
    })
    /*Ваша аутентифікація успішна - почекайте секунду.*/
    return(
        <motion.div
            className="preloader__base"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.5 }}
        >
            <div id="preloader">
                <div className="spinner">
          <span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
                    <div className="base">
                        <span></span>
                        <div className="face"></div>
                    </div>
                </div>
                <div className="longfazers">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className="preloader__base__success">
                Ваша аутентифiкацiя успiшна - почекайте секунду
            </div>
        </motion.div>
    )
}
export default Code;