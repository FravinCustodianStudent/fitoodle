import {useHttp} from "../../hooks/http.hook";
import {setUser} from "../../slices/userSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";


const AuthChecker = ()=>{

    const {GET} = useHttp()
    const jwt = localStorage.getItem("gwt");
    if (jwt!=null){

    }
    return null;



}

export default AuthChecker;