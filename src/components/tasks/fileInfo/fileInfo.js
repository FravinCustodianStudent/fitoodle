import fileSrc from "../../../assets/file.svg";
import {HandySvg} from "handy-svg";
import "./fileInfo.scss"

const FileInfo = () =>{
    return(
       <div className="assignment__main__description__task__item">
            <div className="assignment__main__description__task__item__icon"><HandySvg src={fileSrc}/></div>
            <div className="assignment__main__description__task__item__name">Sit sagittis ultrices scelerisque....</div>
        </div>
    )
}

export default FileInfo;