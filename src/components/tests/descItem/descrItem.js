import "./descrItem.scss";
const DescrItem = ({number,content,answerType}) =>{
    return(
        <div className={answerType ? "question__main__info__content__descr__item" : "question__main__info__content__descr__item  answerDescr"}>
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