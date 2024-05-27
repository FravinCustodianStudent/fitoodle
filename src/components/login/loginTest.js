import "./loginTest.scss";
import "./framer/js"
import {useEffect} from "react";
import Js from "./framer/js";
const LoginTest = () =>{
    const {start} = Js();
    useEffect(() => {
        start();
    }, []);
    return(
        <div className="containerLogin">
            <div className="App">
                <div className="App__main">
                    <div className="App__main__logo">
                        <div className="App__main__logo__item">
                            FIT
                        </div> Learn
                    </div>
                    <div className="App__main__header">Let`s login to your your account</div>
                    <a href={"http://localhost:8010/auth/google/authorize"}><div className="button-container-1"> <span className="mas">Login by Google account</span> <button type="button" name="Hover">Login by Google account</button></div></a>
                    <div className="App__main__subHeader">If you haven't created an account yet, it will be automatically generated upon your first authentication.</div>
                </div>
            </div>
            <canvas/>
        </div>

    )
}

export default LoginTest;