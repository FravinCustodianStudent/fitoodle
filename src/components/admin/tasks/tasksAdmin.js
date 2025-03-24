import React, { useState } from 'react';
import {
    Layout,
    Input,
    Button,
    Select,
    List,
    Card,
    DatePicker,
    Typography,
    Tag,
    Divider,
} from 'antd';
import moment from "moment";

const { Option } = Select;
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const TasksAdmin = () => {
    // State variables
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filterName, setFilterName] = useState('');
    const [filterCreationDate, setFilterCreationDate] = useState(null);
    const [filterDeadline, setFilterDeadline] = useState(null);

    // Sample groups data
    const groups = [
        { id: 'group1', name: 'Group 1' },
        { id: 'group2', name: 'Group 2' },
        { id: 'group3', name: 'Group 3' },
    ];

    // Sample tasks data
    const tasksData = [
        {
            id: 1,
            name: 'Task A',
            creationDate: '2025-03-20',
            deadline: '2025-03-25',
            description: 'This is the description for Task A.',
            files: ['file1.pdf', 'file2.docx'],
            group: 'group1',
            status: 'active', // or "closed" (deadline passed)
            checkUsers: [
                { id: 1, name: 'User1', checked: false },
                { id: 2, name: 'User2', checked: true },
            ],
        },
        {
            id: 2,
            name: 'Task B',
            creationDate: '2025-03-18',
            deadline: '2025-03-22',
            description: 'This is the description for Task B.',
            files: ['file3.pdf'],
            group: 'group1',
            status: 'closed',
            checkUsers: [
                { id: 3, name: 'User3', checked: true },
                { id: 4, name: 'User4', checked: false },
            ],
        },
        // You can add more tasks here…
    ];

    // Filter tasks based on selected group and filters
    const filteredTasks = tasksData.filter((task) => {
        if (selectedGroup && task.group !== selectedGroup) {
            return false;
        }
        if (filterName && !task.name.toLowerCase().includes(filterName.toLowerCase())) {
            return false;
        }
        if (
            filterCreationDate &&
            moment(task.creationDate).format('YYYY-MM-DD') !==
            filterCreationDate.format('YYYY-MM-DD')
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

    // Handlers
    const onGroupChange = (value) => {
        setSelectedGroup(value);
        // Reset the selected task when group changes
        setSelectedTask(null);
    };

    const onTaskSelect = (task) => {
        setSelectedTask(task);
    };

    const clearFilters = () => {
        setFilterName('');
        setFilterCreationDate(null);
        setFilterDeadline(null);
    };

    return (
        <Layout style={{ padding: '20px', height: '100vh' }}>
            <Layout>
                {/* Left panel: group selection, filters, and task list */}
                <Sider width={300} style={{ background: '#fff', padding: '20px' }}>
                    <Title level={4}>Task Administration</Title>
                    <div style={{ marginBottom: '16px' }}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Group"
                            onChange={onGroupChange}
                            value={selectedGroup}
                        >
                            {groups.map((group) => (
                                <Option key={group.id} value={group.id}>
                                    {group.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    {selectedGroup && (
                        <div style={{ marginBottom: '16px' }}>
                            <Text>Selected Group: </Text>
                            <Tag color="blue">
                                {groups.find((g) => g.id === selectedGroup)?.name}
                            </Tag>
                        </div>
                    )}
                    <Divider />
                    <div style={{ marginBottom: '16px' }}>
                        <Input
                            placeholder="Filter by Name"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <DatePicker
                            placeholder="Filter by Creation Date"
                            style={{ width: '100%' }}
                            value={filterCreationDate}
                            onChange={(date) => setFilterCreationDate(date)}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <DatePicker
                            placeholder="Filter by Deadline"
                            style={{ width: '100%' }}
                            value={filterDeadline}
                            onChange={(date) => setFilterDeadline(date)}
                        />
                    </div>
                    <Button type="primary" onClick={clearFilters} block>
                        Clear Filters
                    </Button>
                    <Divider />
                    <List
                        header={<div>Tasks</div>}
                        bordered
                        dataSource={filteredTasks}
                        renderItem={(item) => (
                            <List.Item
                                style={{
                                    cursor: 'pointer',
                                    background:
                                        selectedTask?.id === item.id ? '#e6f7ff' : 'transparent',
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

                {/* Right panel: task details */}
                <Content style={{ padding: '20px', background: '#fff' }}>
                    {selectedTask ? (
                        <Card title={selectedTask.name}>
                            <p>
                                <strong>Created:</strong> {selectedTask.creationDate}
                            </p>
                            <p>
                                <strong>Deadline:</strong> {selectedTask.deadline}
                            </p>
                            <p>
                                <strong>Description:</strong> {selectedTask.description}
                            </p>
                            <Divider>Files</Divider>
                            <List
                                dataSource={selectedTask.files}
                                renderItem={(file) => (
                                    <List.Item>
                                        <a href="#">{file}</a>
                                    </List.Item>
                                )}
                            />
                            <Divider>Users Check</Divider>
                            <List
                                dataSource={selectedTask.checkUsers}
                                renderItem={(user) => (
                                    <List.Item>
                                        <Text>{user.name}</Text>
                                        {user.checked ? (
                                            <Tag color="green">Checked</Tag>
                                        ) : (
                                            <Tag color="orange">Pending</Tag>
                                        )}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    ) : (
                        <div>Please select a task to see details.</div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default TasksAdmin;
