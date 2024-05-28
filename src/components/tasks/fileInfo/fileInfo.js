import fileSrc from "../../../assets/file.svg";
import {HandySvg} from "handy-svg";
import "./fileInfo.scss"

const FileInfo = ({fileId}) =>{
    const makeNameShort = (name) =>{
        return  name.slice(0,28)+"....";

    }
    //TODO make real name - not Id
    return(
       <div className="assignment__main__description__task__item">
            <div className="assignment__main__description__task__item__icon"><HandySvg src={fileSrc}/></div>
            <div className="assignment__main__description__task__item__name">{makeNameShort(fileId)}</div>
        </div>
    )
}

export default FileInfo;