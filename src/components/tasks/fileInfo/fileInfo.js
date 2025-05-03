import fileSrc from "../../../assets/file.svg";
import {HandySvg} from "handy-svg";
import "./fileInfo.scss"
import { motion } from 'framer-motion';
import {RightCircleOutlined} from "@ant-design/icons";
const hoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 }
};

const overlayVariants = {
    rest: { opacity: 0, y: 10 },
    hover: { opacity: 1, y: 0 }
};

const FileInfo = ({file}
) =>{
    const makeNameShort = (name) =>{
        return  name.slice(0,28)+"....";

    }
    return(
        <motion.a
            href={file.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial="rest"
            whileHover="hover"
            animate="rest"
            style={{ display: 'inline-block', position: 'relative', textDecoration: 'none' }}
        >
            <motion.div
                className="assignment__main__description__task__item"
                variants={hoverVariants}
                transition={{ duration: 0.2 }}
                style={{ position: 'relative', overflow: 'hidden' }}
            >
                <div className="assignment__main__description__task__item__icon">
                    <HandySvg src={fileSrc} />
                </div>
                <div className="assignment__main__description__task__item__name">
                    {makeNameShort(file.originalName)}
                </div>

                {/* View overlay */}
                <motion.div
                    className="view-overlay"
                    variants={overlayVariants}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#2b2d42',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        pointerEvents: 'none'
                    }}
                >
                    <RightCircleOutlined style={{marginRight:"5px"}}/>View
                </motion.div>
            </motion.div>
        </motion.a>
    )
}

export default FileInfo;