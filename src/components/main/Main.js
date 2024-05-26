
import "./main.scss";
import SearchInput from "./inputs/SearchInput";
import Task from "./task/task";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useHttp} from "../../hooks/http.hook";
import {Oval} from "react-loader-spinner";

const Main = () => {
    const user = useSelector(state => state.users.user);
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(true)
    const {GET} = useHttp();
    const [Tasks, setTasks] = useState({});
    useEffect(()=>{
            if (Object.keys(user).length!==0){
                getTasks()
            }
    },[user]);

    const getTasks = () =>{
            GET({studentId:user.id},"groupresource/groups/student",{Authorization:localStorage.getItem("jwt")})
                .then((res)=>{
                    console.log(res.data)
                    GET({groupId:res.data.id},"courseresource/courses/by/group",{Authorization:localStorage.getItem("jwt")})
                        .then((result)=>{
                            GET({eduCourseId:result.data[0].id},"taskresource/tasks/by/course",{Authorization:localStorage.getItem("jwt")})
                                .then((spacite)=>{
                                        console.log(spacite.data)
                                       setTasks(spacite.data);
                                        console.log(Tasks.length)
                                    setLoading(false);
                                       // console.log(Tasks[0].deadline );
                                })
                        })
                }).catch(err=>{

            })
    }
    const renderItems = arr =>{
        const items = arr.map((item, i) => {

            return(
                <Task id={Tasks[i].id} deadline={Tasks[i].deadline} taskName={Tasks[i].name} authorId={Tasks[i].authorId} createdAt={Tasks[i].createdAt} />
            )
        })
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
                            <div className="main__content__tasks__info__name__count">3</div>
                        </div>

                        <div className="main__content__tasks__info__search">
                            <SearchInput></SearchInput>
                        </div>
                    </div>
                    <div className="main__content__tasks__list">

                        {items}
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
}
export default Main;