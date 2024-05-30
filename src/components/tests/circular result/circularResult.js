import {buildStyles, CircularProgressbar} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
const CircularResult = ({value}) =>{
    return(
        <div style={{width: 450}}>
            <CircularProgressbar
                value={value}
                text={`${value}%`}

                styles={{
                    path: {
                        // Path color
                        stroke: `#2B2D42`,
                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                        strokeLinecap: 'butt',
                        // Customize transition animation
                        transition: 'stroke-dashoffset 0.5s ease 0s',
                        // Rotate the path
                        transform: 'rotate(0.25turn)',
                        transformOrigin: 'center center',
                    }
                    ,trail: {
                        // Trail color
                        stroke: '#D90429',
                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                        strokeLinecap: 'butt',
                        // Rotate the trail
                        transform: 'rotate(0.25turn)',
                        transformOrigin: 'center center',
                    },
                    text: {
                        // Text color
                        fill: '#2B2D42',
                        // Text size
                        textAlign:"center",
                        fontSize: '24px',
                        fontWeight:900
                    },
                    background: {
                        fill: '#3e98c7',
                    }
                }}
            />
        </div>
    )
}

export default CircularResult;