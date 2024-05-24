import "./descrItem.scss";
const DescrItem = ({number,content,answerType}) =>{
    return(
        <div className={answerType ? "question__main__info__content__descr__item answerDescr" : "question__main__info__content__descr__item"}>
            <div className="question__main__info__content__descr__item__number">
                {number}
            </div>
            <div className="question__main__info__content__descr__item__content">
                {content}
            </div>
        </div>
    )
}
export default DescrItem;