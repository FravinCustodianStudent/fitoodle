import React, { useState, useEffect } from 'react';
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
    const { POST, DELETE } = useHttp();
    const currentUser = useSelector((state) => state.users.user); // Moved to top level
    const [form] = Form.useForm();
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('File must be smaller than 2MB!');
        }
        return isLt2M;
    };

    const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await POST({}, 'fileresource/files', {}, formData);
            onSuccess(response.data, file);
        } catch (error) {
            onError(error);
        }
    };

    const handleRemoveFile = async (file) => {
        try {
            await DELETE({}, `/files/${file.response.id}`, {});
            setUploadedFiles((prev) => prev.filter((f) => f.uid !== file.uid));
            message.success('File removed successfully');
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
            authorId: currentUser.id, // Use currentUser from top-level
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
                    <DatePicker showTime style={{ width: '100%' }} />
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
                <Form.Item label="Attached Files">
                    <Upload.Dragger
                        name="file"
                        multiple
                        customRequest={customRequest}
                        beforeUpload={beforeUpload}
                        onRemove={handleRemoveFile}
                        fileList={uploadedFiles}
                        onChange={(info) => {
                            setUploadedFiles(info.fileList);
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

    // Course selection
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectCourseModalVisible, setSelectCourseModalVisible] = useState(false);
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        GET({}, 'courseresource/courses/all', {})
            .then((res) => setCourses(res.data))
            .catch(() => message.error('Failed to fetch courses'));
    }, [GET]);

    // Tasks state for selected course
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        if (selectedCourse) {
            GET({ eduCourseId: selectedCourse.id }, 'taskresource/tasks/by/course', {})
                .then((res) => setTasks(res.data))
                .catch(() => message.error('Failed to fetch tasks for selected course'));
        } else {
            setTasks([]);
        }
    }, [selectedCourse, GET]);

    // Task filtering states
    const [filterName, setFilterName] = useState('');
    const [filterCreationDate, setFilterCreationDate] = useState(null);
    const [filterDeadline, setFilterDeadline] = useState(null);

    const filteredTasks = tasks.filter((task) => {
        if (selectedCourse && task.eduCourseId !== selectedCourse.id) {
            return false;
        }
        if (filterName && !task.name.toLowerCase().includes(filterName.toLowerCase())) {
            return false;
        }
        if (
            filterCreationDate &&
            moment(task.createdAt).format('YYYY-MM-DD') !== filterCreationDate.format('YYYY-MM-DD')
        ) {
            return false;
        }
        if (
            filterDeadline &&
            moment(task.deadline).format('YYYY-MM-DD') !== filterDeadline.format('YYYY-MM-DD')
        ) {
            return false;
        }
        return true;
    });

    // Filter popover for tasks
    const [filterForm] = Form.useForm();
    const filterContent = (
        <Form
            form={filterForm}
            layout="vertical"
            initialValues={{
                filterName,
                filterCreationDate,
                filterDeadline,
            }}
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

    // Selected task and task result modal states
    const [selectedTask, setSelectedTask] = useState(null);
    const [createTaskDrawerVisible, setCreateTaskDrawerVisible] = useState(false);
    const [taskResults, setTaskResults] = useState([]);
    const [selectedTaskResult, setSelectedTaskResult] = useState(null);
    const [taskResultModalVisible, setTaskResultModalVisible] = useState(false);

    // When selectedTask changes, fetch its task results from API
    useEffect(() => {
        if (selectedTask) {
            GET({ taskId: selectedTask.id }, 'taskresource/taskResult/by/task', {})
                .then((res) => setTaskResults(res.data))
                .catch(() => message.error('Failed to fetch task results'));
        } else {
            setTaskResults([]);
        }
    }, [selectedTask, GET]);

    const onTaskSelect = (task) => {
        setSelectedTask(task);
    };

    // Handler for creating a new task via API
    const handleCreateTask = (newTask) => {
        newTask.authorId = user.id;
        newTask.eduCourseId = selectedCourse.id;
        POST({}, 'taskresource/tasks', {}, newTask)
            .then((res) => {
                setTasks([...tasks, res.data]);
                message.success('Task created successfully');
            })
            .catch((error) => {
                console.error('Failed to create task:', error);
                message.error('Failed to create task');
            });
    };

    // Render task details tabs (Task Details and Task Results)
    const renderTaskTabs = () => {
        if (!selectedTask) return null;
        return (
            <Tabs defaultActiveKey="details" type="line" style={{ padding: '16px 0' }}>
                <TabPane tab="Task Details" key="details">
                    <div style={{ padding: 24 }}>
                        <div style={{ marginBottom: 16 }}>
                            <Title level={3}>{selectedTask.name}</Title>
                        </div>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Text strong>Created:</Text> {selectedTask.createdAt}
                            </Col>
                            <Col span={12}>
                                <Text strong>Deadline:</Text> {selectedTask.deadline}
                            </Col>
                        </Row>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Description:</Text>
                            <p>{selectedTask.description}</p>
                        </div>
                        <Divider>Attached Files</Divider>
                        <List
                            dataSource={selectedTask.attachedFiles}
                            renderItem={(file) => (
                                <List.Item>
                                    <a href="#">{file}</a>
                                </List.Item>
                            )}
                        />
                    </div>
                </TabPane>
                <TabPane tab="Task Results" key="results">
                    <div style={{ padding: 24 }}>
                        <List
                            header={<div>Task Results</div>}
                            dataSource={taskResults}
                            renderItem={(result) => (
                                <List.Item
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelectedTaskResult(result);
                                        setTaskResultModalVisible(true);
                                    }}
                                >
                                    <List.Item.Meta
                                        title={`Result by Student: ${result.studentId}`}
                                        description={`Completed: ${result.completed ? 'Yes' : 'No'} - Completion Time: ${result.completionTime}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </TabPane>
            </Tabs>
        );
    };

    /** TaskResultModal Component:
     * Shows details of a selected task result. It fetches student info and mark info.
     * Teacher can update mark and comment.
     */
    const TaskResultModal = ({ visible, onClose, taskResult }) => {
        const { GET, PUT } = useHttp();
        const [student, setStudent] = useState(null);
        const [mark, setMark] = useState(null);
        const [form] = Form.useForm();

        useEffect(() => {
            if (visible && taskResult) {
                // Fetch student details
                GET({}, `userdataresource/users/${taskResult.studentId}`, {})
                    .then((res) => setStudent(res.data))
                    .catch(() => message.error('Failed to fetch student info'));

                // Fetch mark for this task result
                GET({ taskResultId: taskResult.id }, 'taskresource/marks/by/testResult', {})
                    .then((res) => setMark(res.data))
                    .catch(() => setMark(null));
            }
        }, [visible, taskResult, GET]);

        const handleMarkUpdate = (values) => {
            const updatedMark = {
                id: mark ? mark.id : '',
                taskResultId: taskResult.id,
                userId: student ? student.id : '',
                markValue: values.markValue,
                comment: values.comment,
            };
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
                <Divider />
                <Form form={form} layout="vertical" onFinish={handleMarkUpdate} initialValues={mark || {}}>
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
            </Modal>
        );
    };

    return (
        <Layout style={{ padding: '20px', height: '100vh' }}>
            <Layout>
                {/* Left Sidebar: Course selection, filter popover, search, create task button, and tasks list */}
                <Sider style={{ background: '#fff', padding: '20px' }} width={300}>
                    <Title level={4}>Task Administration</Title>
                    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                        <Button type="primary" onClick={() => setSelectCourseModalVisible(true)}>
                            {selectedCourse ? 'Change Course' : 'Select Course'}
                        </Button>
                        {selectedCourse && (
                            <Tag color="blue" style={{ marginLeft: 8 }}>
                                {selectedCourse.name}
                            </Tag>
                        )}
                    </div>
                    <Divider />
                    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                        <Popover content={filterContent} trigger="click">
                            <Button icon={<FilterOutlined />} />
                        </Popover>
                        <Input
                            style={{ marginLeft: 8 }}
                            placeholder="Search tasks..."
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </div>
                    <Divider />
                    <div style={{ marginBottom: '16px' }}>
                        <Button
                            type="primary"
                            style={{ width: '100%' }}
                            onClick={() => setCreateTaskDrawerVisible(true)}
                            disabled={!selectedCourse}
                        >
                            <PlusCircleOutlined /> Create Task
                        </Button>
                    </div>
                    <List
                        header={<div>Tasks</div>}
                        bordered
                        dataSource={filteredTasks}
                        renderItem={(item) => (
                            <List.Item
                                style={{
                                    cursor: 'pointer',
                                    background: selectedTask?.id === item.id ? '#e6f7ff' : 'transparent',
                                    padding: 12,
                                }}
                                onClick={() => onTaskSelect(item)}
                            >
                                <div>
                                    <Text strong>{item.name}</Text>
                                    <br />
                                    <Text type="secondary">
                                        {item.status === 'active' ? 'Active' : 'Deadline Passed'}
                                    </Text>
                                </div>
                            </List.Item>
                        )}
                    />
                </Sider>

                {/* Right Panel: Task Details Tabs */}
                <Content style={{ padding: '20px', background: '#fff' }}>
                    {selectedTask ? (
                        <Card title="Task Details">
                            <Tabs defaultActiveKey="details" type="line" style={{ padding: '16px 0' }}>
                                <TabPane tab="Task Details" key="details">
                                    <div style={{ padding: 24 }}>
                                        <div style={{ marginBottom: 16 }}>
                                            <Title level={3}>{selectedTask.name}</Title>
                                        </div>
                                        <Row gutter={16} style={{ marginBottom: 16 }}>
                                            <Col span={12}>
                                                <Text strong>Created:</Text> {selectedTask.createdAt}
                                            </Col>
                                            <Col span={12}>
                                                <Text strong>Deadline:</Text> {selectedTask.deadline}
                                            </Col>
                                        </Row>
                                        <div style={{ marginBottom: 16 }}>
                                            <Text strong>Description:</Text>
                                            <p>{selectedTask.description}</p>
                                        </div>
                                        <Divider>Attached Files</Divider>
                                        <List
                                            dataSource={selectedTask.attachedFiles}
                                            renderItem={(file) => (
                                                <List.Item>
                                                    <a href="#">{file}</a>
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                </TabPane>
                                <TabPane tab="Task Results" key="results">
                                    <div style={{ padding: 24 }}>
                                        <List
                                            header={<div>Task Results</div>}
                                            dataSource={tasks.length > 0 ? tasks[0].results || [] : []}
                                            // For demonstration, assume that the selectedTask has a field "results"
                                            // that contains the task results array. In a real app, you would fetch
                                            // these via an API call: GET({ taskId: selectedTask.id }, 'taskresource/taskResult/by/task', {})
                                            renderItem={(result) => (
                                                <List.Item
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setSelectedTaskResult(result);
                                                        setTaskResultModalVisible(true);
                                                    }}
                                                >
                                                    <List.Item.Meta
                                                        title={`Result from Student: ${result.studentId}`}
                                                        description={`Completed: ${result.completed ? 'Yes' : 'No'} | Time: ${result.completionTime}`}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                </TabPane>
                            </Tabs>
                        </Card>
                    ) : (
                        <Card>
                            <Title level={4}>Select a task to see details.</Title>
                        </Card>
                    )}
                </Content>
            </Layout>

            {/* Create Task Drawer Modal */}
            <CreateTaskDrawer
                visible={createTaskDrawerVisible}
                onClose={() => setCreateTaskDrawerVisible(false)}
                onCreate={handleCreateTask}
                selectedCourse={selectedCourse}
            />

            {/* Select Course Modal */}
            <SelectCourseModal
                visible={selectCourseModalVisible}
                onClose={() => setSelectCourseModalVisible(false)}
                onSelect={(course) => setSelectedCourse(course)}
                courses={courses}
            />

            {/* Task Result Modal */}
            {selectedTaskResult && (
                <TaskResultModal
                    visible={taskResultModalVisible}
                    onClose={() => setTaskResultModalVisible(false)}
                    taskResult={selectedTaskResult}
                />
            )}
        </Layout>
    );
};

export default TasksAdmin;
