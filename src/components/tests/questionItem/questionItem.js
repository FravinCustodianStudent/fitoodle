import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

const QuestionItem = ({content,active,loadAnswer}) =>{
    useEffect(() => {

    }, []);
    return(
        <div className={active ?"question__header__list__item active__question": "question__header__list__item"}>
            <div onClick={()=>{loadAnswer(content)}} className="question__header__list__item__content">
                {content}
            </div>

        </div>
    )
}
export default QuestionItem;