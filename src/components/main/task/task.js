import "./task.scss";
import {HandySvg} from "handy-svg";
import arrowSrc from "../../../assets/arrow.svg";
import {Link} from "react-router-dom";
import {useHttp} from "../../../hooks/http.hook";
import {useEffect, useState} from "react";
const Task = ({id,taskName,deadline,createdAt,authorId}) =>{
    const {GET} = useHttp();
    const [author, setAuthor] = useState()
    useEffect(()=>{;
       CreateAuthor(authorId);
    },[])
    const CompareDates = (deadline)=>{
        const today = new Date();
        if (new Date(deadline)>today){
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
        const unformattedDate = new Date(date);
        const readyDate = `${unformattedDate.getDay()}.${unformattedDate.getMonth()}.${unformattedDate.getFullYear()}`
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
                <Link to={`/courses/task/${id}`}><div className="task__action__button"><HandySvg src={arrowSrc}/></div></Link>

            </div>
        </div>
    )
}

export default Task;