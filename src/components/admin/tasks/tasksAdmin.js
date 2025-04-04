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
    message, Tooltip,
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
} from '@ant-design/icons';
import { useHttp } from '../../../hooks/http.hook';
import {useSelector} from "react-redux";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * SelectCourseModal Component
 * Opens a modal to let the user search and select one course from all available courses.
 */
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

/**
 * CreateTaskDrawer Component
 * Opens as a drawer modal to create a new task.
 */
const CreateTaskDrawer = ({ visible, onClose, onCreate, selectedCourse }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        const newTask = {
            id: Date.now().toString(),
            name: values.name,
            authorId: 'CURRENT_USER_ID', // Replace with actual current user id if available
            eduCourseId: selectedCourse ? selectedCourse.id : '',
            maxMarkValue: values.maxMarkValue,
            createdAt: values.createdAt.format('YYYY-MM-DDTHH:mm:ss'),
            deadline: values.deadline.format('YYYY-MM-DD'),
            description: values.description,
            attachedFiles: [],
        };
        onCreate(newTask);
        form.resetFields();
        onClose();
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
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        <PlusCircleOutlined /> Create Task
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

const TasksAdmin = () => {
    const { GET,POST } = useHttp();
    const user = useSelector(state => state.users.user);
    // State for selected course (fetched via API)
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectCourseModalVisible, setSelectCourseModalVisible] = useState(false);
    const [courses, setCourses] = useState([]);

    // When component mounts, fetch courses from API.
    useEffect(() => {
        GET({}, 'courseresource/courses/all', {})
            .then((res) => setCourses(res.data))
            .catch(() => message.error('Failed to fetch courses'));
    }, [GET]);

    // State for tasks fetched via API (linked to selected course)
    const [tasks, setTasks] = useState([]);

    // Fetch tasks when selectedCourse changes
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

    // Filter tasks based on selected course and filters
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

    // Filter popover for task filters
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

    // State for selected task
    const [selectedTask, setSelectedTask] = useState(null);

    const onTaskSelect = (task) => {
        setSelectedTask(task);
    };

    // Drawer visibility for creating a new task
    const [createTaskDrawerVisible, setCreateTaskDrawerVisible] = useState(false);

    // Handler for creating a new task
    const handleCreateTask = (newTask) => {

        newTask.authorId = user.id;
        newTask.eduCourseId = selectedCourse.id;
        POST({}, 'taskresource/tasks', {}, newTask)
            .then((res) => {
                // Assuming the API returns the created task in res.data
                setTasks([...tasks, res.data]);
                console.log(res.data);
                message.success('Task created successfully');
            })
            .catch((error) => {
                console.error('Failed to create task:', error);
                message.error('Failed to create task');
            });
    };

    // Render task details tabs on the right panel
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
                        <Text>Task results will be displayed here.</Text>
                    </div>
                </TabPane>
            </Tabs>
        );
    };

    return (
        <Layout style={{ padding: '20px', height: '100vh' }}>
            <Layout>
                {/* Left Sidebar: Course selection, filter and tasks list */}
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
                            style={{ width: '100%', ...( !selectedCourse && { backgroundColor: '#f0f0f0', borderColor: '#d9d9d9', color: '#999', cursor: 'not-allowed' } ) }}
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
                        <Card title="Task Details">{renderTaskTabs()}</Card>
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
        </Layout>
    );
};

export default TasksAdmin;
