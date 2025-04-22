import "./testAssigment.scss";
import {HandySvg} from "handy-svg";
import resultSrc from "../../assets/result.svg";
import infoSrc from "../../assets/info.svg";
import arrowSrc from "../../assets/arrow.svg"
import {useHttp} from "../../hooks/http.hook";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {Oval} from "react-loader-spinner";
import {Link} from "react-router-dom";
import {Image} from "antd";
const TestAssigment = () =>{
    const {GET} = useHttp();
    const [testConfig, setTestConfig] = useState()
    const [task, setTask] = useState();
    const [test, setTest] = useState()
    const {taskId} = useParams();
    const {testId} = useParams();
    const [Loading, setLoading] = useState(true)
    const user = useSelector(state => state.users.user);
    useEffect(() => {
        if (Object.keys(user).length!==0){
            GET({taskId:taskId},"testingresource/testConfigs/by/task",{})
                .then((res)=>{
                    setTest(res.data);
                    GET({testConfigId:res.data.id,userId:user.id},"testingresource/tests/by/testConfig/user",{})
                        .then((result)=>{
                            setTestConfig(result.data);
                            GET({taskId:taskId},`taskresource/tasks/${taskId}`,{})
                                .then((res)=>{
                                    console.log(res);
                                    setTask(res.data);
                                    setLoading(false);
                                })
                        });
                });
        }

    }, [user]);
    // Helpers for Google Drive thumbnail URLs
    function getDriveFileId(url) {
        const m = url.match(/\/d\/([^/]+)\//);
        return m ? m[1] : null;
    }
    function getDriveThumbnailUrl(url) {
        const id = getDriveFileId(url);
        return id ? `https://drive.google.com/thumbnail?id=${id}` : url;
    }
    const renderItem = () =>{
        return(
            <div className="test-assignment">
                <div className="test-assignment__header">
                    <div className="test-assignment__header__name">
                        <div className="test-assignment__header__name__text">{test.name}</div>
                        <div className="test-assignment__header__name__info">
                            <div className="test-assignment__header__name__info__type">Test</div>
                            <div className="test-assignment__header__name__info__separator"></div>
                            <div className="test-assignment__header__name__info__date">{test.timeLimitation} minutes</div>
                        </div>
                    </div>
                    <div className="test-assignment__header__info">
                        <div className="test-assignment__header__info__details">
                            <div className="test-assignment__header__info__details__questions-marks">due date {task.deadline}</div>
                            <div className="test-assignment__header__info__details__mark">
                                <div className="test-assignment__header__info__details__mark__name">Current result</div>
                                <div className="test-assignment__header__info__details__mark__content">0/{task.maxMarkValue}</div>
                            </div>
                        </div>
                        <div className="test-assignment__header__info__icon">
                            <div className="test-assignment__header__info__icon__svg">
                                <HandySvg src={resultSrc}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="test-assignment__main">
                    <div className="test-assignment__main__description">
                        <div className="test-assignment__main__description__info">
                            <div className="test-assignment__main__description__info__header">
                                <div className="test-assignment__main__description__info__header__icon"><HandySvg src={infoSrc}/></div>
                                <div className="test-assignment__main__description__info__header__name">Загальна кількість питань</div>
                            </div>
                            <div className="test-assignment__main__description__info__date">{testConfig.questions.length} питань на {task.maxMarkValue} балів</div>
                            <div className="test-assignment__main__description__info__content">
                                {test.description}
                            </div>
                            <div className="test-assignment__main__description__info__control-button">
                                <Link to={`/courses/task/test/${taskId}/${test.id}/${testConfig.id}/question`}><div className="test-assignment__main__description__info__control-button__icon">
                                    <HandySvg src={arrowSrc}/>
                                </div></Link>


                            </div>
                        </div>
                    </div>
                </div>
                <div className="test-assignment__main__description">
                    <div className="test-assignment__main__description__image">
                        {/*<Image*/}
                        {/*    width={415}*/}
                        {/*    src={getDriveThumbnailUrl(task[0].attachedFiles)}*/}
                        {/*/>*/}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>{Loading ?<div className="oval__loader"><Oval
            visible={true}
            height="120"
            width="120"
            color="#D90429"
            secondaryColor="#2B2D42"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
        /></div> : renderItem()}</>
    )
}

export default TestAssigment;