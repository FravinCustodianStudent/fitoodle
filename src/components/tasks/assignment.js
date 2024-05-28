import "./assignment.scss";
import resultSrc from "../../assets/result.svg";
import infoSrc from "../../assets/info.svg";
import uploadSrc from "../../assets/upload.svg";
import arrowSrc from "../../assets/arrow.svg";
import downoloadSrc from "../../assets/downoload.svg";
import {HandySvg} from "handy-svg";
import FileForCheck from "./fileForCheck/fileForCheck";
import FileInfo from "./fileInfo/fileInfo";
import {useHttp} from "../../hooks/http.hook";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Oval} from "react-loader-spinner";
const Assignment = () =>{
    const {GET} = useHttp();
    const [Loading, setLoading] = useState(true)
    const user = useSelector(state => state.users.user);
    const {taskId} = useParams();
    const [Mark, setMark] = useState();
    const [TaskResult, setTaskResult] = useState();
    const [Task, setTask] = useState({});
    useEffect(() => {
        console.log(user)
        //TODO fix user bad request - see console
        if (user.length!==0){
            GET({},`taskresource/tasks/${taskId}`,{Authorization:localStorage.getItem("jwt")})
                .then((res)=>{
                    setTask(res.data);
                    GET({taskId:res.data.id,userId:user.id},`taskresource/taskResult/by/task/user`,{Authorization:localStorage.getItem("jwt")})
                        .then((result)=>{
                            setTaskResult(result.data)
                            GET({taskResultId:result.data.id},`taskresource/marks/by/testResult`,{Authorization:localStorage.getItem("jwt")})
                                .then((markRes)=>{
                                    setMark(markRes.data)
                                    setLoading(false);
                                })
                        })
                        .catch((err)=>{
                            console.log(err)
                        });
                })
        }

    }, [user]);

    const ConvertDate = (date) =>{
        const [datePart, timePart] = date.split('T')
        const [year, month, day] = datePart.split('-').map(Number);
        const unformattedDate = new Date(year, month - 1, day);
        const readyDate = `${unformattedDate.getDay()<10?"0"+unformattedDate.getDay():unformattedDate.getDay()}.${
            unformattedDate.getMonth()+1<10?"0"+(unformattedDate.getMonth()+1):(unformattedDate.getMonth()+1)}.${
            unformattedDate.getFullYear()}`
        return readyDate;
    }
    const renderFileForUpload = arr =>{
        console.log(arr)
        const items = arr.map(item => {
            return <FileInfo fileId={item}/>;
        })
        console.log(items)
        return(
            items
        )
    }
    return (
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
            /></div> : <div className="assignment">
                <div className="assignment__header">
                    <div className="assignment__header__name">
                        <div className="assignment__header__name__text">{Task.name}</div>
                        <div className="assignment__header__name__info">
                            <div className="assignment__header__name__info__type">Lab</div>
                            <div className="assignment__header__name__info__separator"></div>
                            <div className="assignment__header__name__info__date">{ConvertDate(Task.createdAt)}</div>
                        </div>
                    </div>
                    <div className="assignment__header__info">
                        <div className="assignment__header__info__details">
                            <div className="assignment__header__info__details__date">due date {ConvertDate(Task.deadline)}</div>
                            <div className="assignment__header__info__details__mark">
                                <div className="assignment__header__info__details__mark__name">Current result</div>
                                <div className="assignment__header__info__details__mark__content">{Mark.markValue}/{Task.maxMarkValue}</div>
                            </div>
                        </div>
                        <div className="assignment__header__info__icon">
                            <div className="assignment__header__info__icon__svg">
                                <HandySvg src={resultSrc}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="assignment__main">
                    <div className="assignment__main__description">
                        <div className="assignment__main__description__info">
                            <div className="assignment__main__description__info__header">
                                <div className="assignment__main__description__info__header__icon"><HandySvg src={infoSrc}/></div>
                                <div className="assignment__main__description__info__header__name">Загальна інформація</div>
                            </div>
                            <div className="assignment__main__description__info__content">
                                {Task.description}
                            </div>
                        </div>
                        <div className="assignment__main__description__task">
                            {renderFileForUpload(Task.attachedFiles)}
                        </div>
                    </div>
                    {/*TODO make form real not mock*/}
                    <div className="assignment__main__upload">
                        <div className="assignment__main__upload__header">
                            <div className="assignment__main__upload__header__icon"><HandySvg src={uploadSrc}/></div>
                            <div className="assignment__main__upload__header__name">task</div>
                        </div>
                        <div className="assignment__main__upload__files">
                            <FileForCheck/>
                        </div>
                        <div className="assignment__main__upload__buttons">
                            <div className="assignment__main__upload__buttons__upload">
                                <HandySvg src={downoloadSrc}/>
                                <div className="assignment__main__upload__buttons__upload__text">Завантажити файл</div>
                            </div>
                            <div className="assignment__main__upload__buttons__confirm">
                                <HandySvg src={arrowSrc}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>

    )
}
export default Assignment;