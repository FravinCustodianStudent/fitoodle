// src/LoginTest.jsx
import React, { useEffect, useMemo } from 'react';
import { motion }             from 'framer-motion';
import createTetris            from './framer/js';
import './loginTest.scss';

const LoginTest = () => {
    const { start } = useMemo(() => createTetris(), []);
    useEffect(() => {
        start();
    }, [start]);

    return (
        <div className="containerLogin" style={{ background: 'white' }}>
            <motion.div className="App">
                <motion.div
                    className="App__main"
                    animate={{ y: [-400, 0, 0], height: [10, 10, 500] }}
                    transition={{ duration: 1, times: [0, 0.6, 1] }}
                >
                    <motion.div
                        className="App__main__logo"
                        animate={{
                            opacity: [0, 0, 1],
                            y: [200, 0, 0],
                            x: [40, 40, 0],
                        }}
                        transition={{ duration: 1.5, times: [0, 0.9, 1] }}
                    >
                        <div className="App__main__logo__item">FIT</div>
                        <motion.div
                            animate={{ opacity: [0, 0, 0, 1], x: [-50, -50, 0] }}
                            transition={{ duration: 2, times: [0, 0.8, 0.9, 1] }}
                        >Learn</motion.div>
                    </motion.div>

                    <motion.div
                        className="App__main__header"
                        animate={{ opacity: [0, 0, 1], y: [200, 0, 0] }}
                        transition={{ duration: 1.5, times: [0, 0.9, 1] }}
                    >
                        Let‘s login to your account
                    </motion.div>

                    <motion.a
                        href="http://localhost:8010/auth/google/authorize"
                        animate={{ opacity: [0, 0, 1], y: [200, 0, 0] }}
                        transition={{ duration: 1.5, times: [0, 0.9, 1] }}
                    >
                        <div className="button-container-1">
                            <button
                                type="button"
                                className="click-btn "
                                data-hover="Go next"
                            >
                                <span>Login by Google account</span>
                            </button>
                        </div>
                    </motion.a>

                    <motion.div
                        className="App__main__subHeader"
                        animate={{ opacity: [0, 0, 1], y: [200, 0, 0] }}
                        transition={{ duration: 1.5, times: [0, 0.9, 1] }}
                    >
                        If you haven't created an account yet, it will be automatically
                        generated upon your first authentication.
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginTest;
