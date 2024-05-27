import "./loginTest.scss";
import "./framer/js"
import {useEffect} from "react";
import Js from "./framer/js";
import { motion } from 'framer-motion';
const LoginTest = () =>{
    const {start} = Js();
    useEffect(() => {
        start();
    }, []);
    return(
        <div className="containerLogin">
            <motion.div className="App" >
                <motion.div className="App__main"
                            animate={{
                                y:[-400,0,0],
                                height:[10,10,500]
                            }}
                            transition={{ duration: 1   , times: [0, 0.6, 1] }}>
                    <motion.div className="App__main__logo"
                    animate={{
                        opacity:[0,0,1],
                        y:[200,0,0],
                        x:[40,40,0]
                    }}
                                transition={{duration:1.5,times:[0,0.9,1]}}
                    >
                        <div className="App__main__logo__item">
                            FIT
                        </div> <motion.div
                        animate={{
                            opacity:[0,0,0,1],
                            x:[-50,-50,0]
                        }}
                        transition={{duration:2,times:[0,0.8,0.9,1]}}
                    >Learn</motion.div>
                    </motion.div>
                    <motion.div
                        animate={{
                            opacity:[0,0,1],
                            y:[200,0,0]
                        }}
                        transition={{duration:1.5,times:[0,0.9,1]}}
                        className="App__main__header">Let`s login to your your account</motion.div>
                    <motion.a
                        animate={{
                            opacity:[0,0,1],
                            y:[200,0,0]
                        }}
                        transition={{duration:1.5,times:[0,0.9,1]}}
                        href={"http://localhost:8010/auth/google/authorize"}><div className="button-container-1"> <span className="mas">Login by Google account</span> <button type="button" name="Hover">Login by Google account</button></div></motion.a>
                    <motion.div
                        animate={{
                            opacity:[0,0,1],
                            y:[200,0,0]
                        }}
                        transition={{duration:1.5,times:[0,0.9,1]}}
                        className="App__main__subHeader">If you haven't created an account yet, it will be automatically generated upon your first authentication.</motion.div>
                </motion.div>
            </motion.div>
            <canvas/>
        </div>

    )
}

export default LoginTest;