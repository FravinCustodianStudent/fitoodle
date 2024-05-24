import "./testAssigment.scss";
import {HandySvg} from "handy-svg";
import resultSrc from "../../assets/result.svg";
import infoSrc from "../../assets/info.svg";
import arrowSrc from "../../assets/arrow.svg"

const TestAssigment = () =>{
    return (
        <div className="test-assignment">
            <div className="test-assignment__header">
                <div className="test-assignment__header__name">
                    <div className="test-assignment__header__name__text">Lorem ipsum dolor sit amet consectetur. Morbi consectetur sodales pellentesque.</div>
                    <div className="test-assignment__header__name__info">
                        <div className="test-assignment__header__name__info__type">Lab</div>
                        <div className="test-assignment__header__name__info__separator"></div>
                        <div className="test-assignment__header__name__info__date">22.08.2023</div>
                    </div>
                </div>
                <div className="test-assignment__header__info">
                    <div className="test-assignment__header__info__details">
                        <div className="test-assignment__header__info__details__questions-marks">due date 23.01.24</div>
                        <div className="test-assignment__header__info__details__mark">
                            <div className="test-assignment__header__info__details__mark__name">Current result</div>
                            <div className="test-assignment__header__info__details__mark__content">0/10</div>
                        </div>
                    </div>
                    <div className="test-assignment__header__info__icon">
                        <div className="test-assignment__header__info__icon__svg">
                            <HandySvg src={resultSrc}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="test-assignment__main">
                <div className="test-assignment__main__description">
                    <div className="test-assignment__main__description__info">
                        <div className="test-assignment__main__description__info__header">
                            <div className="test-assignment__main__description__info__header__icon"><HandySvg src={infoSrc}/></div>
                            <div className="test-assignment__main__description__info__header__name">Загальна кількість питань</div>
                        </div>
                        <div className="test-assignment__main__description__info__date">20 питань на 10 балів</div>
                        <div className="test-assignment__main__description__info__content">
                            Lorem ipsum dolor sit amet consectetur. Sit sagittis ultrices scelerisque leo. Ut facilisis id <span>a morbi vestibulum semper euismod lacinia lorem. Non eu aliquam aenean maecenas sit.</span>

                            Donec ut pellentesque pulvinar non. In amet tincidunt netus quam mauris turpis. Sit pellentesque maecenas felis dignissim fringilla non pharetra viverra vulputate. Semper sit mi in sollicitudin consectetur eu scelerisque velit facilisi.
                        </div>
                        <div className="test-assignment__main__description__info__control-button">
                           <a><div className="test-assignment__main__description__info__control-button__icon">
                               <HandySvg src={arrowSrc}/>
                           </div></a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestAssigment;