import "./courseListItem.scss";
import {HandySvg} from "handy-svg";
import accountSrc from "../../../../assets/account.svg";
import labSrc from "../../../../assets/lab.svg";
import arrowSrc from   "../../../../assets/arrow.svg"
const CourseListItem = () =>{
    return <div className="class__details__content__list__content__item">
        <div className="class__details__content__list__content__item__container">
            <div className="class__details__content__list__content__item__container__header">
                <div className="class__details__content__list__content__item__container__header__name">
                    <div className="class__details__content__list__content__item__container__header__name__icon">
                        <HandySvg src={labSrc}/>
                    </div>
                    <div className="class__details__content__list__content__item__container__header__name__content">Lorem ipsum dolor sit amet consectetur.</div>
                </div>
                <div className="class__details__content__list__content__item__container__header__teacher">
                    <div className="class__details__content__list__content__item__container__header__teacher__icon">
                        <HandySvg src={accountSrc}/>
                    </div>
                    <div className="class__details__content__list__content__item__container__header__teacher__content">Прокопенко Максим Васильович</div>
                </div>
            </div>
            <div className="class__details__content__list__content__item__container__text">
                Lorem ipsum dolor sit amet consectetur. Id nulla vel sollicitudin eget malesuada in. Quisque a pharetra dignissim vel nunc nec amet fringilla....
            </div>
        </div>
        <div className="class__details__content__list__content__item__link">
            <div className="class__details__content__list__content__item__link__mark">0/5</div>
            <a href=""><div className="class__details__content__list__content__item__link__button"> <HandySvg src={arrowSrc}/></div></a>

        </div>
    </div>
}
export default CourseListItem;