import "./task.scss";
import {HandySvg} from "handy-svg";
import arrowSrc from "../../../assets/arrow.svg";
import {Link} from "react-router-dom";
import {useHttp} from "../../../hooks/http.hook";
import {useEffect, useState} from "react";
import {useErrorBoundary, withErrorBoundary} from "react-use-error-boundary";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
const Task = withErrorBoundary(({id,testId,taskName,deadline,createdAt,authorId}) =>{
    const {GET} = useHttp();
    const [author, setAuthor] = useState()
    const [error,resetError] = useErrorBoundary();
    const [test, setTest] = useState(null)
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
       CreateAuthor(authorId);
       if(testId && !test){
           GET({taskId:id},"testingresource/testConfigs/by/task")
               .then((res)=>{
                   console.log(res.data)
                   setTest(res.data);
                   setLoading(false);
               }).catch((err)=>{
                   console.log(err)
                error(err);
           })
       } else if(!testId){
           setLoading(false);
       }


    },[test])
    const CompareDates = (deadline)=>{
        const today = new Date();
        const [year, month, day] = deadline.split('-').map(Number);
        if (new Date(year, month - 1, day)<today){
            return true;
        }
    }
    const CreateAuthor = (autorId) =>{
        GET({},"userdataresource/users/"+autorId,{Authorization:localStorage.getItem("jwt")})
            .then((res)=>{
                const authorFullName = res.data.firstName + " " + res.data.lastName;
                setAuthor(authorFullName)
            });
    }
    const ConvertDate = (date) =>{

        const [datePart, timePart] = date.split('T')

        const [year, month, day] = datePart.split('-').map(Number);
        const unformattedDate = new Date(year, month - 1, day);
        const readyDate = `${unformattedDate.getDay()<10?"0"+unformattedDate.getDay():unformattedDate.getDay()}.${
            unformattedDate.getMonth()+1<10?"0"+(unformattedDate.getMonth()+1):(unformattedDate.getMonth()+1)}.${
            unformattedDate.getFullYear()}`
        return readyDate;
    }
    const renderContent = () => {
        if (testId){
            return (<div className={CompareDates(deadline)? "task outdated":"task"} >
                <div className="task__info">
                    <div className="task__info__status"></div>
                    <div className="task__info__name">
                        <div className="task__info__name__task">{test.name}</div>
                        <div className="task__info__name__teacher">{author}</div>
                    </div>
                </div>
                <div className="task__action">
                    <div className="task__action__dates">
                        <div className="task__action__dates__from">
                            <div className="task__action__dates__from__name">Дата створення</div>
                            <div className="task__action__dates__from__separator"></div>
                            <div className="task__action__dates__from__content">{ConvertDate(createdAt)}</div>
                        </div>
                        <div className="task__action__dates__to">
                            <div className="task__action__dates__to__name">Дата здачі</div>
                            <div className="task__action__dates__to__separator"></div>
                            <div className="task__action__dates__to__content">{ConvertDate(deadline)}</div>
                        </div>
                    </div>
                    <Link to={`/courses/task/test/${id}/${test.id}`}><div className="task__action__button"><HandySvg src={arrowSrc}/></div></Link>


                </div>
            </div>)
        }else {
            return (<div className={CompareDates(deadline)? "task outdated":"task"} >
                <div className="task__info">
                    <div className="task__info__status"></div>
                    <div className="task__info__name">
                        <div className="task__info__name__task">{taskName}</div>
                        <div className="task__info__name__teacher">{author}</div>
                    </div>
                </div>
                <div className="task__action">
                    <div className="task__action__dates">
                        <div className="task__action__dates__from">
                            <div className="task__action__dates__from__name">Дата створення</div>
                            <div className="task__action__dates__from__separator"></div>
                            <div className="task__action__dates__from__content">{ConvertDate(createdAt)}</div>
                        </div>
                        <div className="task__action__dates__to">
                            <div className="task__action__dates__to__name">Дата здачі</div>
                            <div className="task__action__dates__to__separator"></div>
                            <div className="task__action__dates__to__content">{ConvertDate(deadline)}</div>
                        </div>
                    </div>
                    <Link to={`/courses/task/${id}`}><div className="task__action__button"><HandySvg src={arrowSrc}/></div></Link>


                </div>
            </div>)
        }

    }
    return(
        <>
            {!loading?renderContent():   <Spin indicator={<LoadingOutlined spin />} size="large" />}

        </>

    )
})

export default Task;