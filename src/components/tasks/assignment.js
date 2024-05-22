import "./assignment.scss";
import resultSrc from "../../assets/result.svg";
import infoSrc from "../../assets/info.svg";
import uploadSrc from "../../assets/upload.svg";
import arrowSrc from "../../assets/arrow.svg";
import downoloadSrc from "../../assets/downoload.svg";
import {HandySvg} from "handy-svg";
import FileForCheck from "./fileForCheck/fileForCheck";
import FileInfo from "./fileInfo/fileInfo";
const Assignment = () =>{
    return (
        <div className="assignment">
            <div className="assignment__header">
                <div className="assignment__header__name">
                    <div className="assignment__header__name__text">Lorem ipsum dolor sit amet consectetur. Morbi consectetur sodales pellentesque.</div>
                    <div className="assignment__header__name__info">
                        <div className="assignment__header__name__info__type">Lab</div>
                        <div className="assignment__header__name__info__separator"></div>
                        <div className="assignment__header__name__info__date">22.08.2023</div>
                    </div>
                </div>
                <div className="assignment__header__info">
                    <div className="assignment__header__info__details">
                        <div className="assignment__header__info__details__date">due date 23.01.24</div>
                        <div className="assignment__header__info__details__mark">
                            <div className="assignment__header__info__details__mark__name">Current result</div>
                            <div className="assignment__header__info__details__mark__content">0/10</div>
                        </div>
                    </div>
                    <div className="assignment__header__info__icon">
                        <div className="assignment__header__info__icon__svg">
                            <HandySvg src={resultSrc}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="assignment__main">
                <div className="assignment__main__description">
                    <div className="assignment__main__description__info">
                        <div className="assignment__main__description__info__header">
                            <div className="assignment__main__description__info__header__icon"><HandySvg src={infoSrc}/></div>
                            <div className="assignment__main__description__info__header__name">Загальна інформація</div>
                        </div>
                        <div className="assignment__main__description__info__content">
                            Lorem ipsum dolor sit amet consectetur. Sit sagittis ultrices scelerisque leo. Ut facilisis id <span>a morbi vestibulum semper euismod lacinia lorem. Non eu aliquam aenean maecenas sit.</span>

                            Donec ut pellentesque pulvinar non. In amet tincidunt netus quam mauris turpis. Sit pellentesque maecenas felis dignissim fringilla non pharetra viverra vulputate. Semper sit mi in sollicitudin consectetur eu scelerisque velit facilisi.
                        </div>
                    </div>
                    <div className="assignment__main__description__task">
                        <FileInfo/>
                        <FileInfo/>
                        <FileInfo/>
                        <FileInfo/>
                        <FileInfo/>
                    </div>
                </div>
                <div className="assignment__main__upload">
                  <div className="assignment__main__upload__header">
                    <div className="assignment__main__upload__header__icon"><HandySvg src={uploadSrc}/></div>
                      <div className="assignment__main__upload__header__name">task</div>
                  </div>
                    <div className="assignment__main__upload__files">
                        <FileForCheck/>
                    </div>
                    <div className="assignment__main__upload__buttons">
                        <div className="assignment__main__upload__buttons__upload">
                            <HandySvg src={downoloadSrc}/>
                            <div className="assignment__main__upload__buttons__upload__text">Завантажити файл</div>
                        </div>
                        <div className="assignment__main__upload__buttons__confirm">
                            <HandySvg src={arrowSrc}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Assignment;