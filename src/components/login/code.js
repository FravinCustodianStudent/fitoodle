import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {useHttp} from "../../hooks/http.hook";
import "./login.scss";
import {setUser} from "../../slices/userSlice";
import {useDispatch} from "react-redux";
import "./code.scss"
const Code = () => {

    const {Auth,GET} = useHttp();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const Login = (code) =>{
        Auth("auth/google/authentication",code)
            .then((res)=>{
                GET(null,"authresource/auth/login",{"Authorization":res.headers.authorization})
                    .then((res)=>{
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
      <div className="preloader__base">
          <div id='preloader'>
              <div className='spinner'>
          <span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
                  <div className='base'>
                      <span></span>
                      <div className='face'></div>
                  </div>
              </div>
              <div class='longfazers'>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
              </div>
          </div>
          <div className="preloader__base__success">Ваша аутентифiкацiя успiшна - почекайте секунду</div>
      </div>
    )
}
export default Code;