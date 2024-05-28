import "./task.scss";
import {HandySvg} from "handy-svg";
import arrowSrc from "../../../assets/arrow.svg";
import {Link} from "react-router-dom";
import {useHttp} from "../../../hooks/http.hook";
import {useEffect, useState} from "react";
import {useErrorBoundary, withErrorBoundary} from "react-use-error-boundary";
const Task = withErrorBoundary(({id,taskName,deadline,createdAt,authorId}) =>{
    const {GET} = useHttp();
    const [author, setAuthor] = useState()
    const [error,resetError] = useErrorBoundary();
    const [testExisting, setTestExisting] = useState(false);
    const [test, setTest] = useState()
    useEffect(()=>{
       CreateAuthor(authorId);
       GET({taskId:id},"testingresource/testConfigs/by/task",{Authorization:localStorage.getItem("jwt")})
           .then((res)=>{
               console.log(res);
               if (res.data!==null){
                   setTestExisting(true);
                   setTest(res.data);
               }
           }).catch((err)=>{

       })
    },[])
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
    return(
        <div className={CompareDates(deadline)? "task outdated":"task"} >
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
                {testExisting ? <Link to={`/courses/task/test/${test.id}`}><div className="task__action__button"><HandySvg src={arrowSrc}/></div></Link> :
                    <Link to={`/courses/task/${id}`}><div className="task__action__button"><HandySvg src={arrowSrc}/></div></Link>}


            </div>
        </div>
    )
})

export default Task;