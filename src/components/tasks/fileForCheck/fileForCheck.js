import fileSrc from "../../../assets/file.svg";
import successSrc from "../../../assets/success.svg";
import {HandySvg} from "handy-svg";
import "./fileForCheck.scss";

const FileForCheck = () =>{
    return(
        <div className="assignment__main__upload__files__item ">
            <div className="assignment__main__upload__files__item__name">
                <div className="assignment__main__upload__files__item__name__icon"><HandySvg src={fileSrc}/></div>
                <div className="assignment__main__upload__files__item__name__separator"></div>
                <div className="assignment__main__upload__files__item__name__content">Sit sagittis ultrices scelerisque....</div>
            </div>

            <div className="assignment__main__upload__files__item__process"><HandySvg src={successSrc}/></div>
        </div>
    )
}

export default FileForCheck;