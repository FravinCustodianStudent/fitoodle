import React, { useState, useCallback, useEffect } from 'react';
import { Select, Spin, Card, Typography, Alert } from 'antd';
import {useHttp} from "../../../hooks/http.hook";

const { Title, Paragraph } = Typography;

/**
 * Кастомний хук для роботи з курсами.
 * Використовує метод GET з useHttp для отримання списку курсів та даних конкретного курсу.
 */
export const useCourseService = () => {
    const { GET } = useHttp();
    const [courses, setCourses] = useState([]);
    const [courseInfo, setCourseInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Отримання списку курсів
    const fetchCourseList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET(null, 'courseresource/courses/all');
            setCourses(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [GET]);

    // Отримання даних конкретного курсу по courseId
    const fetchCourseInfo = useCallback(async (courseId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET(null, `courseresource/courses/${courseId}`);
            setCourseInfo(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [GET]);

    return { courses, courseInfo, fetchCourseList, fetchCourseInfo, loading, error };
};

/**
 * Компонент CourseInfoComponent:
 * - При завантаженні отримує список курсів.
 * - Дозволяє вибрати курс із випадаючого списку.
 * - Після вибору завантажує та відображає детальну інформацію про курс.
 */
const CourseInfoComponent = () => {
    const {
        courses,
        courseInfo,
        fetchCourseList,
        fetchCourseInfo,
        loading,
        error,
    } = useCourseService();

    const [selectedCourseId, setSelectedCourseId] = useState(null);

    // Отримання списку курсів при першому рендері
    useEffect(() => {
        fetchCourseList();
    }, [fetchCourseList]);

    // Після вибору курсу – завантаження даних про курс
    useEffect(() => {
        if (selectedCourseId) {
            fetchCourseInfo(selectedCourseId);
        }
    }, [selectedCourseId, fetchCourseInfo]);

    const handleSelectChange = (value) => {
        setSelectedCourseId(value);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Title level={3}>Select a Course</Title>
            {error && (
                <Alert
                    message="Error"
                    description={error.message || 'Something went wrong.'}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
            <Select
                placeholder="Select a course"
                style={{ width: 300, marginBottom: '24px' }}
                onChange={handleSelectChange}
                value={selectedCourseId}
                loading={loading}
            >
                {courses &&
                    courses.map((course) => (
                        <Select.Option key={course.id} value={course.id}>
                            {course.name}
                        </Select.Option>
                    ))}
            </Select>
            {loading && <Spin />}
            {courseInfo && (
                <Card title={`Course Details: ${courseInfo.name}`} style={{ marginTop: '24px' }}>
                    <Paragraph>
                        <strong>ID:</strong> {courseInfo.id}
                    </Paragraph>
                    <Paragraph>
                        <strong>Teacher ID:</strong> {courseInfo.teacherId}
                    </Paragraph>
                    <Paragraph>
                        <strong>Target Groups:</strong> {courseInfo.targetGroups.join(', ')}
                    </Paragraph>
                    <Paragraph>
                        <strong>Laborants:</strong> {courseInfo.laborants.join(', ')}
                    </Paragraph>
                    <Paragraph>
                        <strong>Messages:</strong> {courseInfo.messages.join(', ')}
                    </Paragraph>
                </Card>
            )}
        </div>
    );
};

export default CourseInfoComponent;
