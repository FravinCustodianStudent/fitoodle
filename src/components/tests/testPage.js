import {HandySvg} from "handy-svg";
import timerSrc from "../../assets/timer.svg";
import "./testPage.scss";
import QuestionItem from "./questionItem/questionItem";
import questionSrc from "../../assets/question.svg";
import DescrItem from "./descItem/descrItem";
import boldArrowSrc from "../../assets/boldArrow.svg";
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


                    </div>
                    <div className="question__main__info__content">
                        <div className="question__main__info__content__descr">
                            <DescrItem number={1}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />
                            <DescrItem number={2}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />
                            <DescrItem number={3}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />
                            <DescrItem number={4}
                                       content={"Lorem ipsum dolor sit amet consectetur. Consectetur interdum morbi nisi proin ac nam consectetur quis ultrices. Eu tellus proin enim accumsan eget arcu. Amet porta ornare arcu lacus ornare. Neque nibh commodo nulla ultricies neque augue. In ut ornare sapien metus ac eget nec. "} />
                        </div>
                        <div className="question__main__info__content__descr">
                            <DescrItem number={'A'} answerType={true}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />
                            <DescrItem number={'B'} answerType={true}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />
                            <DescrItem number={'C'} answerType={true}
                                       content={"Lorem ipsum dolor sit amet consectetur. Eget diam habitasse hac nam pulvinar massa velit. "} />
                            <DescrItem number={'D'} answerType={true}
                                       content={"Lorem ipsum dolor sit amet consectetur. Consectetur interdum morbi nisi proin ac nam consectetur quis ultrices. Eu tellus proin enim accumsan eget arcu. Amet porta ornare arcu lacus ornare. Neque nibh commodo nulla ultricies neque augue. In ut ornare sapien metus ac eget nec. "} />
                        </div>
                    </div>

                </div>
                <div className="question__main__answer">
                    <div className="question__main__answer__content">
                        <div className="question__main__answer__content__header">
                            <div className="question__main__answer__content__header__item">
                                <HandySvg src={boldArrowSrc}/>
                            </div>
                            <div className="question__main__answer__content__header__item">
                                A
                            </div>
                            <div className="question__main__answer__content__header__item">
                                B
                            </div>
                            <div className="question__main__answer__content__header__item">
                                C
                            </div>
                            <div className="question__main__answer__content__header__item">
                                D
                            </div>
                        </div>
                        <div className="question__main__answer__content__row">
                            <div className="question__main__answer__content__row__number">
                                    1
                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                            <div className="question__main__answer__content__row__item selected__answer">

                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                        </div><div className="question__main__answer__content__row">
                        <div className="question__main__answer__content__row__number">
                            2
                        </div>
                        <div className="question__main__answer__content__row__item">

                        </div>
                        <div className="question__main__answer__content__row__item">

                        </div>
                        <div className="question__main__answer__content__row__item ">

                        </div>
                        <div className="question__main__answer__content__row__item">

                        </div>
                    </div>
                        <div className="question__main__answer__content__row">
                            <div className="question__main__answer__content__row__number">
                                3
                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                            <div className="question__main__answer__content__row__item ">

                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                        </div>
                        <div className="question__main__answer__content__row">
                            <div className="question__main__answer__content__row__number">
                                4
                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                            <div className="question__main__answer__content__row__item">

                            </div>
                        </div>


                    </div>
                    <div className="question__main__answer__container">
                        <div className="question__main__answer__container__button">
                            <HandySvg src={arrowtSrc}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestPage;