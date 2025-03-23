
import "./main.scss";
import SearchInput from "./inputs/SearchInput";
import Task from "./task/task";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useHttp} from "../../hooks/http.hook";
import {Oval} from "react-loader-spinner";
import {useErrorBoundary, withErrorBoundary} from "react-use-error-boundary";

const Main = withErrorBoundary(() => {
    const user = useSelector(state => state.users.user);
    const [error, setError] = useState(false)
    const [errorH, resetError] = useErrorBoundary((error,errorInfo)=>{
            console.log(error);
            console.log(errorInfo)
    }
    )
    const [Loading, setLoading] = useState(true)
    const {GET} = useHttp();
    const [Tasks, setTasks] = useState({});
    useEffect(()=>{
            if (Object.keys(user).length!==0 && !error ){
                getTasks()
            }
    },[user,error]);

    const getTasks = () =>{
            GET({studentId:user.id},"userdataresource/groups/by-student",{})
                .then((res)=>{
                    console.log(user.data)
                    GET({groupId:res.data.id},"courseresource/courses/by/group",{})
                        .then((result)=>{
                                GET({eduCourseId:result.data[0].id},"taskresource/tasks/by/course",{})
                                    .then((spacite)=>{
                                        console.log(spacite)
                                        console.log(spacite.data.length)

                                        if (spacite.data.length!==0 && spacite.data !==null){
                                            setTasks(spacite.data);
                                            console.log(Tasks)
                                            setLoading(false);
                                            // console.log(Tasks[0].deadline );
                                        }else {
                                            setLoading(false)
                                            setError(true)
                                        }

                                    })

                        })
                }).catch(err=>{
                    console.log(err)
                setLoading(false)
                setError(true)

            })
    }
    const renderItems = arr =>{
        let items;
        if (!error){
             items = arr.map((item, i) => {

                return(
                    <Task id={Tasks[i].id} deadline={Tasks[i].deadline} taskName={Tasks[i].name} authorId={Tasks[i].authorId} createdAt={Tasks[i].createdAt} />
                )
            })
        }

    return(
        <div className="main">
            <div className="main__name">
                <h1>
                    Добрий день, <Link to={"/"}>{user.firstName+ " "+user.lastName}</Link>
                </h1>
            </div>
            <div className="main__content">
                <div className="main__content__tasks">
                    <div className="main__content__tasks__info">
                        <div className="main__content__tasks__info__name">
                            <div className="main__content__tasks__info__name__text">Завдання</div>
                            {error ? <div className="main__content__tasks__info__name__count">0</div>:
                                <div className="main__content__tasks__info__name__count">3</div>}

                        </div>

                        <div className="main__content__tasks__info__search">
                            <SearchInput></SearchInput>
                        </div>
                    </div>
                    <div className="main__content__tasks__list">

                        {error? "Завдань немає" : items}
                    </div>
                </div>
                <div className="main__content__schedule"></div>
            </div>

        </div>
    )
    }
    ;
    return(
        <>
            {Loading ?<div className="oval__loader"><Oval
                visible={true}
                height="120"
                width="120"
                color="#D90429"
                secondaryColor="#2B2D42"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            /></div> : renderItems(Tasks)}
        </>

    )
});
export default Main;