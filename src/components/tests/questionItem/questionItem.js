
const QuestionItem = ({content,active}) =>{
    return(
        <div className={active ?"question__header__list__item active__question": "question__header__list__item"}>
            <div className="question__header__list__item__content">
                {content}
            </div>

        </div>
    )
}
export default QuestionItem;