import "./descrItem.scss";
import {useEffect, useState} from "react";
const DescrItem = ({number,content,id,setAnswer,answer}) =>{
    const [answerType, setAnswerType] = useState(false);
    useEffect(() => {
        //console.log(answer.includes(id));
        if(answer.includes(id)){
            setAnswerType(true)
        }else {
            setAnswerType(false)
        }
    }, [answer]);
    const giveAnswer = () =>{
        setAnswerType(!answerType);
        if (!answer.includes(id)){
            const newAnswer = [...answer,id];
            setAnswer(newAnswer);
        }else{
            setAnswer(answer.filter(item=> item !== id));
        }

    }
    return(
        <div className={answerType ? "question__main__info__content__descr__item" : "question__main__info__content__descr__item  answerDescr"}>
            <div onClick={()=> giveAnswer()} className="question__main__info__content__descr__item__number">
                {number}
            </div>
            <div className="question__main__info__content__descr__item__content">
                {content}
            </div>
        </div>
    )
}
export default DescrItem;