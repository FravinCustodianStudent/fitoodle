import {Link, useRouteError} from "react-router-dom";
import "./errorBoundry.scss";
import {useEffect, useState} from "react";
import {Oval} from "react-loader-spinner";
const ErrorBoundry = () =>{
    const error = useRouteError();
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false)
    }, []);
    const render = () =>{
        return(
            <div className="errorBoundry">

                <div id='oopss'>
                    <div id='error-text'>
                        <img src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg" alt="404"/>
                        <span> 404</span>
                        <p className="p-a">Сторінка не знайдена</p>
                        <Link to={"/"} className="back">На головну</Link>
                    </div>
                </div>

            </div>
        )
    }
    return(
        <>
            { Loading ? <div className="oval__loader"><Oval
                visible={true}
                height="120"
                width="120"
                color="#D90429"
                secondaryColor="#2B2D42"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            /></div>: render()}
        </>
    )
}
export default ErrorBoundry;