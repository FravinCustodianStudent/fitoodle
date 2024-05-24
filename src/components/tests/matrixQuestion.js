import {HandySvg} from "handy-svg";
import questionSrc from "../../assets/question.svg";
import DescrItem from "./descItem/descrItem";
import boldArrowSrc from "../../assets/boldArrow.svg";
import arrowtSrc from "../../assets/arrow.svg";

const MatrixQuestion = () =>{

    return(
        <>
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
        </>
    )
}

export default MatrixQuestion;