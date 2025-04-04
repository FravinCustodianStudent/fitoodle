import {useCallback} from "react";
import customAxios from "../axios/axiosConfig";
import code from "../components/login/code";

export const useHttp = () =>{
    const baseUrl = "http://localhost:8888/";
    const POSTUPT = useCallback(async (params,route,headers,body)=>{

            //TODO: Redirect if no token presented
            // if (localStorage.getItem('token') === null){
            //     navigate('/login');
            // }
            // setProcess('loading');
            return customAxios.post("http://localhost:8020/"+route,{
                ...body,
                withCredentials: true,
            },{headers:{...headers},params:{...params}});
        },
        []);
    const GET = useCallback(async (params,route,headers)=>{

            //TODO: Redirect if no token presented
            // if (localStorage.getItem('token') === null){
            //     navigate('/login');
            // }
            // setProcess('loading');
            return customAxios.get(baseUrl+route,{
                withCredentials: true,
                params: {...params},
                headers: {...headers}
            });
        },
        []);
    const POST = useCallback(async (params,route,headers,body)=>{

            //TODO: Redirect if no token presented
            // if (localStorage.getItem('token') === null){
            //     navigate('/login');
            // }
            // setProcess('loading');
            return customAxios.post(baseUrl+route,{
                ...body,
                withCredentials: true,
            },{headers:{...headers},params:{...params}});
        },
        []);
    const PUT = useCallback(async (params,route,headers,body)=>{

            //TODO: Redirect if no token presented
            // if (localStorage.getItem('token') === null){
            //     navigate('/login');
            // }
            // setProcess('loading');
            return customAxios.put(baseUrl+route,{
                ...body
            },{ withCredentials: true,
                params: {...params},
                headers: {...headers},});
        },
        []);
    const DELETE = useCallback(async (params,route,headers)=>{
            //TODO: Redirect if no token presented
            // if (localStorage.getItem('token') === null){
            //     navigate('/login');
            // }
            // setProcess('loading');
            return customAxios.delete(baseUrl+route,{
                withCredentials: true,
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
       // const url = `${baseUrl}/authresource/auth/google/authentication?code=${params}`;
            const url = `/auth/google/authentication?code=${params}`;
        console.log(params)
            return await customAxios.get(url,
                {
                    withCredentials: true,
                    params:{'code':params},
                    headers:{"Access-Control-Expose-Headers":"Access-Token, Uid"}
                })
        },
        []);
    return {GET,POST,PUT,DELETE,Auth,POSTUPT};
}