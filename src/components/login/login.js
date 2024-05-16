import "./login.scss";

const Login = () => {
    return(
        <div className="App">
            <div className="App__main">
                <div className="App__main__logo">
                    <div className="App__main__logo__item">
                        FIT
                    </div> Learn
                </div>
                <div className="App__main__header">Let`s login to your your account</div>
                <a href={"http://localhost:8010/auth/google/authorize"}><div className="App__main__button"> login by Google account </div></a>
                <div className="App__main__subHeader">If you haven't created an account yet, it will be automatically generated upon your first authentication.</div>
            </div>
            <div className="App__bg">
                <img src={require("../../assets/LoginBG.png")} alt="BG"/>
            </div>
        </div>
    )
}
export default Login;