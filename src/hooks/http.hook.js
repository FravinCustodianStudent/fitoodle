import {useCallback} from "react";
import customAxios from "../axios/axiosConfig";
import code from "../components/login/code";

export const useHttp = () =>{
    const baseUrl = "http://localhost:8010";

    const GET = useCallback(async (params,route,headers)=>{

            //TODO: Redirect if no token presented
            // if (localStorage.getItem('token') === null){
            //     navigate('/login');
            // }
            // setProcess('loading');
            return customAxios.get(baseUrl+route,{
                params: {...params},
                headers: {...headers}
            });
        },
        []);
    const Auth = useCallback(async (route,params)=>{

            //TODO: Redirect if no token presented
            // if (localStorage.getItem('token') === null){
            //     navigate('/login');
            // }
            // setProcess('loading');
        const url = `http://localhost:8010/auth/google/authentication?code=${params}`;
            console.log(url)
        console.log(params)
            return await customAxios.get('http://localhost:8010/auth/google/authentication',
                {
                    params:{'code':params},
                    headers:{"Access-Control-Expose-Headers":"Access-Token, Uid"}
                })
        },
        []);
    return {GET,Auth};
}