import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useHttp} from "../../hooks/http.hook";
import "./login.scss";
import {userLoaded} from "../../slices/userSlice";
import {useDispatch} from "react-redux";

const Code = () => {

    const {Auth,GET} = useHttp()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(()=>{
      const code = searchParams.get("code");
      console.log(code)
        // {"Authorization":`Bearer ${code}`}
        Auth("auth/login",code)
            .then((res)=>{

                console.log(res)
                console.log(res.body)
               GET(null,"/auth/login",{"authorization":res.headers.authorization})
                   .then((res)=>{
                       console.log(res)
                       dispatch(userLoaded(res.data))
                       navigate("/")
                   })
            })
            .catch((err)=>{
                console.log(err)
            })
    })

    return(
      <div>
          Ваша аутентифікація успішна - почекайте секунду.

      </div>
    )
}
export default Code;