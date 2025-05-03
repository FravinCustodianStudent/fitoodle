import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import courseSrc from "../../assets/course.svg";
import "./courses.scss";
import { HandySvg } from "handy-svg";
import Course from "./course/course";
import { useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { Link } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { withErrorBoundary } from "react-use-error-boundary";

const Courses = withErrorBoundary(() => {
    const { GET } = useHttp();
    const user = useSelector((state) => state.users.user);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!error && user && Object.keys(user).length) {
            GET({ studentId: user.id }, "userdataresource/groups/by-student", {})
                .then((res) =>
                    GET(
                        { groupId: res.data.id },
                        "courseresource/courses/by/group",
                        {}
                    )
                )
                .then((result) => {
                    setCourses(result.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError(true);
                    setLoading(false);
                });
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
            className="courses"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="courses__name"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>
                    Ваші курси,&nbsp;
                    <Link to="/">{user.firstName + " " + user.lastName}</Link>
                </h1>
            </motion.div>

            <div className="courses__content">
                <div className="courses__content__cousrses">
                    <div className="courses__content__cousrses__name">
                        Курси <HandySvg src={courseSrc} />
                    </div>

                    <motion.div
                        className="courses__content__cousrses__list"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.1 } },
                        }}
                    >
                        {error ? (
                            <div className="courses__no-courses">курсів немає</div>
                        ) : (
                            courses.map((c) => (
                                <Course
                                    id={c.id}
                                    nameOfCourse={c.name}
                                    idOfTeacher={c.teacherId}
                                />
                            ))
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
});

export default Courses;
