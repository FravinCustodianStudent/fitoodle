import "./main.scss";
import SearchInput from "./inputs/SearchInput";
import Task from "./task/task";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { Oval } from "react-loader-spinner";
import { withErrorBoundary } from "react-use-error-boundary";
import { motion } from "framer-motion";

const Main = withErrorBoundary(() => {
    const user = useSelector((state) => state.users.user);
    const { GET } = useHttp();
    const [Tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!error && user && Object.keys(user).length) {
            GET({ studentId: user.id }, "userdataresource/groups/by-student", {})
                .then((res) =>
                    GET({ groupId: res.data.id }, "courseresource/courses/by/group", {})
                )
                .then((result) => {
                    if (result.data.length) {
                        return GET(
                            { eduCourseId: result.data[0].id },
                            "taskresource/tasks/by/course",
                            {}
                        );
                    } else {
                        setTasks([]);
                        setLoading(false);
                        throw new Error("No courses");
                    }
                })
                .then((tasksRes) => {
                    if (tasksRes.data && tasksRes.data.length) {
                        setTasks(tasksRes.data);
                    } else {
                        setError(true);
                    }
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false));
        }
    }, [user, error, GET]);

    if (loading) {
        return (
            <div className="oval__loader">
                <Oval
                    visible
                    height="120"
                    width="120"
                    color="#D90429"
                    secondaryColor="#2B2D42"
                    ariaLabel="oval-loading"
                />
            </div>
        );
    }

    return (
        <motion.div
            className="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="main__name"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>
                    Добрий день,&nbsp;
                    <Link to="/">{user.firstName + " " + user.lastName}</Link>
                </h1>
            </motion.div>

            <div className="main__content">
                <div className="main__content__tasks">
                    <div className="main__content__tasks__info">
                        <motion.div
                            className="main__content__tasks__info__name"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="main__content__tasks__info__name__text">
                                Завдання
                            </div>
                            <div className="main__content__tasks__info__name__count">
                                {error ? 0 : Tasks.length}
                            </div>
                        </motion.div>

                        <motion.div
                            className="main__content__tasks__info__search"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <SearchInput />
                        </motion.div>
                    </div>

                    <motion.div
                        className="main__content__tasks__list"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        {error ? (
                            <div className="main__no-tasks">Завдань немає</div>
                        ) : (
                            Tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Task
                                        testId={task.testId}
                                        id={task.id}
                                        deadline={task.deadline}
                                        taskName={task.name}
                                        authorId={task.authorId}
                                        createdAt={task.createdAt}
                                    />
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </div>

                <div className="main__content__schedule"></div>
            </div>
        </motion.div>
    );
});

export default Main;
