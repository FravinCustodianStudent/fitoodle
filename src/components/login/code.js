import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useHttp} from "../../hooks/http.hook";
import "./login.scss";
import {setUser} from "../../slices/userSlice";
import {useDispatch} from "react-redux";

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
                        console.log(res.data)
                        localStorage.setItem("jwt",res.headers.authorization);
                        console.log(localStorage.getItem("jwt"))
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

    return(
      <div>
          Ваша аутентифікація успішна - почекайте секунду.

      </div>
    )
}
export default Code;