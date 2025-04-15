import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spin } from 'antd';
import {
    Layout,
    Input,
    Button,
    List,
    Card,
    DatePicker,
    Typography,
    Tag,
    Divider,
    Popover,
    Form,
    Drawer,
    Row,
    Col,
    Modal,
    Tabs,
    Upload,
    message,
    Tooltip,
} from 'antd';
import moment from 'moment';
import {
    FilterOutlined,
    PlusCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    SearchOutlined,
    TeamOutlined,
    FileTextOutlined,
    CheckSquareOutlined,
    BookOutlined,
    UserOutlined,
    IdcardOutlined,
    SmileOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';
import { useHttp } from '../../../hooks/http.hook';
import { useSelector } from 'react-redux';
import {DownloadIcon} from "lucide-react";
import TaskDetailsCard from "./TaskDetailsCard";
import {useNavigate, useSearchParams} from "react-router-dom";
import {theme} from "antd/lib";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

/** SelectCourseModal: Allows selection of a course from the list fetched from API */
const SelectCourseModal = ({ visible, onClose, onSelect, courses }) => {
    const [filterText, setFilterText] = useState('');
    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(filterText.toLowerCase())
    );
    return (
        <Modal visible={visible} title="Select Course" onCancel={onClose} footer={null}>
            <Input
                placeholder="Search courses..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                prefix={<SearchOutlined />}
                style={{ marginBottom: 16 }}
            />
            <List
                dataSource={filteredCourses}
                renderItem={(course) => (
                    <List.Item
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            onSelect(course);
                            onClose();
                        }}
                    >
                        <List.Item.Meta title={course.name} />
                    </List.Item>
                )}
            />
        </Modal>
    );
};

/** CreateTaskDrawer: Drawer modal to create a new task with drag-and-drop file upload */
const CreateTaskDrawer = ({ visible, onClose, onCreate, selectedCourse }) => {
    const { FilePost, POST, DELETE, GET } = useHttp();
    const currentUser = useSelector((state) => state.users.user);
    const [previewingFileId, setPreviewingFileId] = useState(null);
    const [form] = Form.useForm();
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({ createdAt: moment() });
        }
    }, [visible, form]);

    const beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('File must be smaller than 2MB!');
        }
        return isLt2M;
    };

    const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
        const newFile = {
            uid: file.uid,
            name: file.name,
            status: 'uploading',
            percent: 0,
        };
        setUploadedFiles(prev => [...prev, newFile]);

        const formData = new FormData();
        formData.append('file', file);

        // емуляція прогресу (наприклад, 1 секунда = 100%)
        let percent = 0;
        const fakeProgress = setInterval(() => {
            percent += 10;
            setUploadedFiles(prev =>
                prev.map(f =>
                    f.uid === file.uid ? { ...f, percent } : f
                )
            );
            if (percent >= 90) clearInterval(fakeProgress);
        }, 100);

        try {
            const res = await FilePost('fileresource/files', formData);

            clearInterval(fakeProgress);

            setUploadedFiles(prev =>
                prev.map(f =>
                    f.uid === file.uid
                        ? { ...f, status: 'done', percent: 100, response: res.data }
                        : f
                )
            );
            onSuccess(res.data, file);
            message.success(`${file.name} uploaded`);
        } catch (err) {
            clearInterval(fakeProgress);
            setUploadedFiles(prev =>
                prev.map(f =>
                    f.uid === file.uid
                        ? { ...f, status: 'error', percent: 100 }
                        : f
                )
            );
            onError(err);
            message.error(`Upload failed: ${file.name}`);
        }
    };


    const handleRemoveFile = async (file) => {
        try {
            await DELETE({}, `fileresource/files/${file.response.id}`, {});
            setUploadedFiles((prev) => prev.filter((f) => f.uid !== file.uid));
            message.success(`${file.name} removed`);
        } catch (error) {
            console.error('Failed to remove file:', error);
            message.error('Failed to remove file');
        }
    };

    const handleFinish = (values) => {
        const fileIds = uploadedFiles.map((file) => file.response.id);
        const newTask = {
            id: Date.now().toString(),
            name: values.name,
            authorId: currentUser.id,
            eduCourseId: selectedCourse ? selectedCourse.id : '',
            maxMarkValue: values.maxMarkValue,
            createdAt: values.createdAt.format('YYYY-MM-DDTHH:mm:ss'),
            deadline: values.deadline.format('YYYY-MM-DD'),
            description: values.description,
            attachedFiles: fileIds,
        };

        POST({}, 'taskresource/tasks', {}, newTask)
            .then((res) => {
                onCreate(res.data);
                message.success('Task created successfully');
                form.resetFields();
                setUploadedFiles([]);
                onClose();
            })
            .catch((error) => {
                console.error('Failed to create task:', error);
                message.error('Failed to create task');
            });
    };

    return (
        <Drawer
            title="Create New Task"
            placement="right"
            closable
            onClose={onClose}
            visible={visible}
            width={400}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="Task Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter task name' }]}
                >
                    <Input placeholder="Enter task name" />
                </Form.Item>
                <Form.Item
                    label="Max Mark Value"
                    name="maxMarkValue"
                    rules={[{ required: true, message: 'Please enter max mark value' }]}
                >
                    <Input type="number" placeholder="Max Mark" />
                </Form.Item>
                <Form.Item
                    label="Creation Date"
                    name="createdAt"
                    rules={[{ required: true, message: 'Please select creation date' }]}
                >
                    <DatePicker showTime style={{ width: '100%' }} disabled />
                </Form.Item>
                <Form.Item
                    label="Deadline"
                    name="deadline"
                    rules={[{ required: true, message: 'Please select deadline' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter task description' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter task description" />
                </Form.Item>
                <Form.Item label="Upload Files">
                    <Upload.Dragger
                        name="file"
                        customRequest={customRequest}
                        fileList={uploadedFiles}
                        onRemove={handleRemoveFile}
                        showUploadList={{
                            showRemoveIcon: true,
                            showDownloadIcon: false,
                            showPreviewIcon: false,
                        }}
                        onPreview={async (file) => {
                            if (file?.response?.id) {
                                const res = await GET({}, `fileresource/files/${file.response.id}`, {});
                                window.open(res.data.driveUrl, '_blank');
                            }
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <PlusCircleOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to upload</p>
                        <p className="ant-upload-hint">Max file size 2MB</p>
                    </Upload.Dragger>

                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        <PlusCircleOutlined /> Create Task
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};



/** TaskResultModal Component
 * Opens when a teacher clicks on a task result in the "Task Results" tab.
 * It fetches student data and current mark (if any), then allows teacher to enter a mark and comment.
 */
const TaskResultModal = ({ visible, onClose, taskResult }) => {
    const { GET, PUT } = useHttp();
    const [student, setStudent] = useState(null);
    const [mark, setMark] = useState(null);
    const [form] = Form.useForm();

    // Fetch student data using taskResult.studentId
    useEffect(() => {
        if (visible && taskResult) {
            GET({}, `userdataresource/users/${taskResult.studentId}`, {})
                .then((res) => setStudent(res.data))
                .catch(() => message.error('Failed to fetch student info'));
        }
    }, [visible, taskResult, GET]);

    // Fetch current mark (if any) using taskResult.id
    useEffect(() => {
        if (visible && taskResult) {
            GET({ taskResultId: taskResult.id }, 'taskresource/marks/by/testResult', {})
                .then((res) => setMark(res.data))
                .catch(() => {
                    // If not found, mark remains null
                    setMark(null);
                });
        }
    }, [visible, taskResult, GET]);

    const handleFinish = (values) => {
        // Construct updated mark object
        const updatedMark = {
            id: mark ? mark.id : '', // if mark exists, update it; if not, you might need to POST (not covered here)
            taskResultId: taskResult.id,
            userId: student ? student.id : '',
            markValue: values.markValue,
            comment: values.comment,
        };
        // For simplicity, assume mark always exists and update with PUT.
        PUT({}, `taskresource/marks/${updatedMark.id}`, {}, updatedMark)
            .then(() => {
                message.success('Mark updated successfully');
                onClose();
            })
            .catch(() => message.error('Failed to update mark'));
    };

    return (
        <Modal visible={visible} title="Task Result Details" onCancel={onClose} footer={null}>
            {student ? (
                <div>
                    <Title level={4}>
                        {student.firstName} {student.lastName}
                    </Title>
                    <Text>{student.contactEmail}</Text>
                </div>
            ) : (
                <Text>Loading student information...</Text>
            )}
            <Divider />
            <div>
                <Text strong>Completion Time: </Text>
                <Text>{taskResult.completionTime}</Text>
            </div>
            <div style={{ marginTop: 16 }}>
                <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={mark || {}}>
                    <Form.Item
                        label="Mark Value"
                        name="markValue"
                        rules={[{ required: true, message: 'Please enter a mark' }]}
                    >
                        <Input type="number" placeholder="Enter mark" />
                    </Form.Item>
                    <Form.Item
                        label="Comment"
                        name="comment"
                        rules={[{ required: true, message: 'Please enter a comment' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Enter comment" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Update Mark
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

const TasksAdmin = () => {
    const { GET, POST } = useHttp();
    const user = useSelector((state) => state.users.user);
    const [searchParams, setSearchParams] = useSearchParams();
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectCourseModalVisible, setSelectCourseModalVisible] = useState(false);
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [createTaskDrawerVisible, setCreateTaskDrawerVisible] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [filterCreationDate, setFilterCreationDate] = useState(null);
    const [filterDeadline, setFilterDeadline] = useState(null);
    const [filterForm] = Form.useForm();

    useEffect(() => {
        GET({}, 'courseresource/courses/all', {})
            .then(res => {
                setCourses(res.data)
                const courseIdFromParams = searchParams.get('courseId');
                if (courseIdFromParams) {
                    const matchedCourse = res.data.find(course => course.id === courseIdFromParams);
                    if (matchedCourse) {
                        setSelectedCourse(matchedCourse);
                    }
                }

            })
            .catch(() => message.error('Failed to fetch courses'));
    }, [GET]);

    useEffect(() => {
        if (selectedCourse) {
            GET({ eduCourseId: selectedCourse.id }, 'taskresource/tasks/by/course', {})
                .then(res => setTasks(res.data))
                .catch(() => message.error('Failed to fetch tasks'));
        } else {
            setTasks([]);
        }
    }, [selectedCourse, GET]);

    const filteredTasks = tasks.filter((task) => {
        if (selectedCourse && task.eduCourseId !== selectedCourse.id) return false;
        if (filterName && !task.name.toLowerCase().includes(filterName.toLowerCase())) return false;
        if (filterCreationDate && moment(task.createdAt).format('YYYY-MM-DD') !== filterCreationDate.format('YYYY-MM-DD')) return false;
        if (filterDeadline && moment(task.deadline).format('YYYY-MM-DD') !== filterDeadline.format('YYYY-MM-DD')) return false;
        if (task.testId !== null) return false;
        return true;
    });

    const onTaskSelect = (task) => {
        setSelectedTask(task);
    };

    const handleCreateTask = (newTask) => {
        const payload = {
            ...newTask,
            id: Date.now().toString(),
            authorId: user.id,
            eduCourseId: selectedCourse.id,
            testId: null,
        };
        setTasks([...tasks, ...payload]);

    };

    const handleUpdateTask = (updatedTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        setSelectedTask(updatedTask);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setSelectedTask(null);
    };
    const filterContent = (
        <Form
            form={filterForm}
            layout="vertical"
            initialValues={{ filterName, filterCreationDate, filterDeadline }}
            onFinish={(values) => {
                setFilterName(values.filterName || '');
                setFilterCreationDate(values.filterCreationDate || null);
                setFilterDeadline(values.filterDeadline || null);
            }}
        >
            <Form.Item label="Name" name="filterName">
                <Input placeholder="Filter by Name" />
            </Form.Item>
            <Form.Item label="Creation Date" name="filterCreationDate">
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Deadline" name="filterDeadline">
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
                <Row justify="space-between">
                    <Col>
                        <Tooltip title="Clear Filters">
                            <Button
                                type="link"
                                icon={<CloseCircleOutlined />}
                                onClick={() => {
                                    filterForm.resetFields();
                                    setFilterName('');
                                    setFilterCreationDate(null);
                                    setFilterDeadline(null);
                                }}
                            >
                                Clear
                            </Button>
                        </Tooltip>
                    </Col>
                    <Col>
                        <Tooltip title="Apply Filters">
                            <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                                Apply Filters
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    );

    return (
        <Layout style={{ height: '100vh' }}>
            <Layout >
                {/* Sidebar */}
                <Sider  style={{ background: '#fff', padding: '20px' }} width={300}>
                    <Title level={4}>Task Administration</Title>
                    <div style={{ marginBottom: 16 }}>
                        <Button type="primary" onClick={() => setSelectCourseModalVisible(true)}>
                            {selectedCourse ? 'Change Course' : 'Select Course'}
                        </Button>
                        {selectedCourse && (
                            <Tag color="red" style={{ marginLeft: 8 }}>{selectedCourse.name}</Tag>
                        )}
                    </div>

                    <Divider />
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <Popover content={filterContent} trigger="click">
                            <Button icon={<FilterOutlined />} />
                        </Popover>
                        <Input
                            placeholder="Search tasks..."
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            style={{ marginLeft: 8 }}
                            prefix={<SearchOutlined />}
                        />
                    </div>

                    <Divider />
                    <Button
                        type="primary"
                        block
                        onClick={() => setCreateTaskDrawerVisible(true)}
                        disabled={!selectedCourse}
                    >
                        <PlusCircleOutlined /> Create Task
                    </Button>

                    <List
                        header={<div>Tasks</div>}
                        bordered
                        dataSource={filteredTasks}
                        style={{ marginTop: 16 }}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => onTaskSelect(item)}
                                style={{
                                    cursor: 'pointer',
                                    background: selectedTask?.id === item.id ? "#2B2D42" : 'transparent',
                                }}
                            >
                                <Text style={{color: selectedTask?.id === item.id ? "white" : 'black'}} strong>{item.name}</Text><br />
                                <Text style={{color: selectedTask?.id === item.id ? "rgba(255, 255,255, 0.6)" : 'rgba(0, 0, 0, 0.45)'}} type="secondary">
                                    {moment(item.deadline).isSameOrAfter(moment(), 'day') ? 'Active' : 'Deadline Passed'}
                                </Text>
                            </List.Item>
                        )}
                    />
                </Sider>

                {/* Content */}
                <Content style={{ padding: '20px', background: '#fff' }}>
                    {selectedTask ? (
                        <TaskDetailsCard
                            task={selectedTask}
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                        />
                    ) : (
                        <Card><Title level={4}>Select a task to see details.</Title></Card>
                    )}
                </Content>
            </Layout>

            {/* Create Task Drawer */}
            <CreateTaskDrawer
                visible={createTaskDrawerVisible}
                onClose={() => setCreateTaskDrawerVisible(false)}
                onCreate={handleCreateTask}
                selectedCourse={selectedCourse}
            />

            {/* Course Selection Modal */}
            <SelectCourseModal
                visible={selectCourseModalVisible}
                onClose={() => setSelectCourseModalVisible(false)}
                onSelect={(course) => {
                    setSelectedCourse(course)
                    setSearchParams({ courseId: course.id });
                }}
                courses={courses}
            />
        </Layout>
    );
};

export default TasksAdmin;
