import {HandySvg} from "handy-svg";
import timerSrc from "../../assets/timer.svg";
import "./testPage.scss";
import QuestionItem from "./questionItem/questionItem";
import questionSrc from "../../assets/question.svg";
import DescrItem from "./descItem/descrItem";
import arrowtSrc from "../../assets/arrow.svg";
import ResultItem from "./questionItem/resultItem";
import CircularResult from "./circular result/circularResult";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams, useSearchParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {addAnswer, loadQuestions, loadTestConfig, modifyAnswerById, setTime} from "../../slices/testSlice";
import {Oval} from "react-loader-spinner";
import { Image } from 'antd';
const TestPage = () =>{
    const [typeOfElement, setTypeOfElement] = useState("s");
    const dispatch = useDispatch();
    const {taskId,testId} = useParams();
    const [Loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [currentQuestionContent, setCurrentQuestionContent] = useState();
    const [answer, setAnswer] = useState([]);
    const answers = useSelector(state => state.tests.answers);
    const testConfig = useSelector(state=>state.tests.testConfig);
    const tests = useSelector(state=>state.tests.tests);
    const user = useSelector(state => state.users.user);
    const startTime = useSelector(state => state.tests.timer)
    const {GET,POST} = useHttp();
    const [eliminationTimer, setEliminationTimer] = useState("");
    const [testResult, setTestResult] = useState()
    useEffect(() => {
        if (user!==null && Object.keys(user).length !==0){
            GET({taskId:taskId},"testingresource/testConfigs/by/task",{Authorization:localStorage.getItem("jwt")})
                .then((res)=>{
                    dispatch(loadTestConfig(res.data));
                    GET({testConfigId:res.data.id,userId:user.id },"testingresource/tests/by/testConfig/user",{Authorization:localStorage.getItem("jwt")})
                        .then((result)=>{
                            dispatch(loadQuestions(result.data));
                            setCurrentQuestionContent(result.data.questions[currentQuestion-1])
                            setLoading(false);
                            let date = new Date()
                            dispatch(setTime(date));
                            date.setMinutes(date.getMinutes() + res.data.timeLimitation);
                            updateRemainingTime(date,res.data.timeLimitation)
                            setInterval(()=>updateRemainingTime(date,res.data.timeLimitation),1000)
                        })
                })
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
    const renderHeader = () =>{

        const items = [];
        for (let i = 1; i < tests.questions.length+1; i++) {
            items.push(<QuestionItem key={i} content={i} loadAnswer={loadAnswer} active={currentQuestion === i}/>)
        }
        return items;

    }
    const checkExisting= (array) =>{

        if (!array || Object.keys(array).length == 0) return true;
        if (!array.find(obj=> obj.questionId ===tests.questions[currentQuestion-1].id)) return true;
        return false;
    }
    const updateRemainingTime = (endDate,minutesAllotted) =>{
        // Получаем текущую дату и время
        const now = new Date();

        // Вычисляем разницу между временем окончания задачи и текущим временем в миллисекундах
        const difference = endDate.getTime() - now.getTime();

        // Если разница меньше или равна нулю, значит время истекло, выводим сообщение и завершаем функцию
        if (difference <= 0) {
            console.log("Время истекло!");
            return;
        }

        // Переводим разницу в секунды
        const secondsRemaining = Math.floor(difference / 1000);

        // Вычисляем оставшиеся минуты и секунды
        const remainingMinutes = Math.floor(secondsRemaining / 60);
        const remainingSeconds = secondsRemaining % 60 <10?"0"+secondsRemaining % 60 :secondsRemaining % 60;
        setEliminationTimer(remainingMinutes +":"+remainingSeconds )
    }
    const setQuestionAnswer =  (numberOfNextQuestion) => {
            if (checkExisting(answers)) {
                const answerObject = {
                    questionId: tests.questions[currentQuestion - 1].id,
                    answersId: [...answer]
                }
                dispatch(addAnswer(answerObject));
                    setAnswer([]);
                    loadAnswer(numberOfNextQuestion);
            }else if(answers.find(obj=> obj.questionId ===tests.questions[currentQuestion-1].id)){
                const answerToUpdate = answers.find(obj=> obj.questionId ===tests.questions[currentQuestion-1].id);
                const updatedAnswer = {
                    questionId:answerToUpdate.questionId,
                    answersId: answer // Здесь вы можете установить новое значение для answersId
                };
                dispatch(modifyAnswerById(updatedAnswer));
                setAnswer([]);
                loadAnswer(numberOfNextQuestion);
            }
            else {
                setAnswer([]);
                loadAnswer(numberOfNextQuestion);
            }

    }
    const formatdDate = (dateObject ) =>{
        const currentDate = new Date(dateObject);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const date = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
        return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }
    const calculateResult=()=>{
        setLoading(true);
        setTypeOfElement("results");
        const objectToCheck = {
            id:tests.id,
            started:true,
            startTime:formatdDate(startTime),
            completionTime:formatdDate(new Date()),
            answers:answers,
            completed:true,
            testMarkValue:testConfig.maxTestMark
        }
        console.log(objectToCheck);
        POST({},`testingresource/tests/${tests.id}/complete`,{},objectToCheck)
            .then((res)=>{
                console.log(res)
                setTestResult(res.data.testResult);
                setLoading(false);

            })
            .catch((err)=>{
                console.log(err)
            })
    }
    const loadAnswer =  (numberOfAnswer) =>{
            if (numberOfAnswer > tests.questions.length) {
                calculateResult();
                return;
            }
            const newAnswers = answers.find(obj=> obj.questionId ===tests.questions[numberOfAnswer-1].id);
            if (newAnswers){
                setAnswer([...newAnswers.answersId])
            }else {
                setAnswer([])
            }
            setCurrentQuestion(numberOfAnswer);
            setCurrentQuestionContent(tests.questions[numberOfAnswer-1]);
            setCurrentQuestion(numberOfAnswer);
    }

    const renderItems = arr =>{
        const variants = ["A","B","C","D"];
        const items = arr.map((item, i) => {
            return  <DescrItem key={i} number={variants[i]} id={currentQuestionContent.answers[i].id} content={currentQuestionContent.answers[i].text} setAnswer={setAnswer} answer={answer}/>;
        })
        return items;
    }
    const containerSwitcher = (typeOfElement) =>{
        switch (typeOfElement){
            case "results":
                return <>
                    <div className="question__header">
                        <div className="question__header__timer test__results">
                            <div className="question__header__timer__name">
                                <div className="question__header__timer__name__icon">

                                </div>
                                <div className="question__header__timer__name__content">
                                    Результат

                                </div>
                            </div>
                            <div className="question__header__timer__content">
                                <HandySvg src={timerSrc}/>
                            </div>
                        </div>

                    </div>
                    <div className="question__main">
                        <div className="question__main__info">
                            <div className="question__main__info__header">
                                <div className="question__main__info__header__content">
                                    <div className="question__main__info__header__content__icon">
                                        <HandySvg src={questionSrc}/>
                                    </div>
                                    <div className="question__main__info__header__content__name">
                                        Результат {(testResult.testMarkValue).toString().substring(0,4) + " бала"}
                                    </div>
                                </div>
                                <div className="question__main__info__header__description">
                                    {testConfig.description}
                                </div>

                            </div>
                        </div>
                        <div className="question__main__result">
                            <CircularResult value={Math.round((testResult.testMarkValue/testConfig.maxTestMark)*100)}/>
                        </div>
                    </div>
                    </>;
                break;
            default :
                return <>
                    <div className="question__header">
                        <div className="question__header__timer">
                            <div className="question__header__timer__name">
                                <div className="question__header__timer__name__icon">
                                    <HandySvg src={timerSrc}/>
                                </div>
                                <div className="question__header__timer__name__content">
                                    Час на проходження
                                </div>
                            </div>
                            <div className="question__header__timer__content">
                                {eliminationTimer}
                            </div>
                        </div>
                        <div className="question__header__list">
                            {renderHeader()}
                        </div>

                    </div>
                    <div className="question__main">
                        <div className="question__main__info">
                            <div className="question__main__info__header">
                                <div className="question__main__info__header__content">
                                    <div className="question__main__info__header__content__icon">
                                        <HandySvg src={questionSrc}/>
                                    </div>
                                    <div className="question__main__info__header__content__name">
                                        Питання - {currentQuestionContent.name}
                                    </div>
                                </div>
                                <div className="question__main__info__header__description">
                                    {currentQuestionContent.questionText}
                                </div>

                            </div>
                            <div className="question__main__info__content">
                                <div className="question__main__info__content__descr multitask">
                                    {renderItems(currentQuestionContent.answers)}
                                </div>
                            </div>
                            <div className="question__main__info__container">
                                <div onClick={()=> calculateResult()} className="question__main__info__container__button-text">
                                    Закінчити роботу над тестом
                                </div>
                                <div onClick={()=>setQuestionAnswer(currentQuestion+1)} className="question__main__info__container__button">
                                    Наступне питання <HandySvg src={arrowtSrc}/>
                                </div>
                            </div>
                        </div>
                        {
                            tests.questions[currentQuestion-1].attachmentUrl? <div className="question__main__image">
                                <Image
                                    width={415}
                                    src={getDriveThumbnailUrl(tests.questions[currentQuestion-1].attachmentUrl)}
                                />
                            </div>:<></>
                        }

                    </div></>;
                break;

        }

    }
    return(
        <div className="question">
            {Loading ? <div className="oval__loader"><Oval
                visible={true}
                height="120"
                width="120"
                color="#D90429"
                secondaryColor="#2B2D42"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            /></div>  : containerSwitcher(typeOfElement)}
        </div>
    )
}

export default TestPage;