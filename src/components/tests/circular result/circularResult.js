import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import {Button, Card, Typography} from 'antd';
import {ArrowRightOutlined}from '@ant-design/icons';
import { motion } from 'framer-motion';
import "react-circular-progressbar/dist/styles.css";
import Title from "antd/es/skeleton/Title";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
const CircularResult = ({ value }) => {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const { Title, Text } = Typography;
    useEffect(() => {
        const duration = 1; // animation duration in seconds
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = (currentTime - startTime) / 1000;
            const currentProgress = Math.min((elapsed / duration) * value, value);
            setProgress(currentProgress);
            if (elapsed < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Card
                style={{
                    padding: '10px 60px',
                    textAlign: 'center',
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    backgroundColor: '#FAFAFB',
                }}
                bodyStyle={{ padding: 24 }}
            >
                {/* Define gradient for the path */}
                <svg style={{ height: 0 }}>
                    <defs>
                        <linearGradient id="gradient" gradientTransform="rotate(90)">
                            <stop offset="0%" stopColor="#D90429" />
                            <stop offset="100%" stopColor="#FF5733" />
                        </linearGradient>
                    </defs>
                </svg>

                <div style={{ width: 350, margin: '0 auto' }}>
                    <CircularProgressbar
                        value={progress}
                        text={`${Math.round(progress)}%`}
                        styles={buildStyles({
                            // Use the gradient for the path
                            pathColor: 'url(#gradient)',
                            trailColor: '#E6E6E6',
                            textColor: '#2B2D42',
                            textSize: '24px',
                            strokeLinecap: 'round',
                        })}
                    />
                </div>

                <Title level={4} style={{ marginTop: 16, color: '#2B2D42' }}>
                    Completion Rate
                </Title>
                <Text type="secondary">Overall progress of your tasks.</Text>

            </Card>
            <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                style={{ marginTop: 16 }}
                onClick={() => navigate(-1)}
            >
                Return To Course
            </Button>
        </motion.div>
    );
};


export default CircularResult;