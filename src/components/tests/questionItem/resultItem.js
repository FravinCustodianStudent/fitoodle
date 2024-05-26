const ResultItem = ({number,failResult}) =>{
    return(
        <div className={failResult ?"question__header__list__item-result failure": "question__header__list__item-result"}>
            <div className="question__header__list__item-result__content">
                {number}
            </div>

        </div>
    )
}
export default ResultItem