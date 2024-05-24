import {HandySvg} from "handy-svg";
import timerSrc from "../../assets/timer.svg";
import "./testPage.scss";
import QuestionItem from "./questionItem/questionItem";
import questionSrc from "../../assets/question.svg";
import DescrItem from "./descItem/descrItem";
import arrowtSrc from "../../assets/arrow.svg";

const TestPage = () =>{

    return(
        <div className="question">
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
                        44:59
                    </div>
                </div>
                <div className="question__header__list">
                    <QuestionItem content={1}/>
                    <QuestionItem content={2}/>
                    <QuestionItem content={3} active={true}/>
                    <QuestionItem content={4}/>
                    <QuestionItem content={5}/>
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
                                Питання 2 - співставте відповіді
                            </div>
                        </div>
                        <div className="question__main__info__header__description">
                            Lorem ipsum dolor sit amet consectetur. Vel odio dui in pellentesque commodo urna. Urna tristique sit eu magna mi integer vitae dictum. Ultrices sodales amet pharetra lectus at urna. Enim ut semper ut rhoncus. In accumsan.
                        </div>

                    </div>
                    <div className="question__main__info__content">
                        <div className="question__main__info__content__descr">
                            <DescrItem number={'A'}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />
                            <DescrItem number={'B'}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />
                        </div>
                        <div className="question__main__info__content__descr">
                            <DescrItem number={'C'} answerType={true}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />
                            <DescrItem number={'D'}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />

                        </div>
                    </div>
                     <div className="question__main__info__container">
                         <div className="question__main__info__container__button-text">
                             Закінчити роботу над тестом
                         </div>
                         <div className="question__main__info__container__button">
                             Наступне питання <HandySvg src={arrowtSrc}/>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    )
}

export default TestPage;