import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    Card,
    Typography,
    Row,
    Col,
    Divider,
    Button,
    List,
    Modal,
    Form,
    Input,
    InputNumber,
    message,
    Tabs,
    Upload,
    Tooltip,
    Descriptions,
    Avatar, DatePicker
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    FileOutlined,
    PlusOutlined,
    EyeOutlined,
    SaveOutlined,
    PlusCircleOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useHttp } from '../../../hooks/http.hook';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const iconButton = (title, icon, onClick, danger = false) => (
    <Tooltip title={title}>
        <Button type="text" icon={icon} onClick={onClick} danger={danger} />
    </Tooltip>
);

const TaskResultModal = ({ visible, onClose, submission, taskMaxMark }) => {
    const { GET, PUT } = useHttp();
    const [files, setFiles] = useState([]);
    const [markData, setMarkData] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!visible || !submission) return;

        // 1. Fetch submission files
        const filesQuery = submission.attachedFiles.map(id => `files=${id}`).join('&');
        GET({}, `fileresource/files/defined?${filesQuery}`, {})
            .then(res => setFiles(res.data))
            .catch(() => message.error('Failed to load submission files'));

        // 2. Fetch existing mark
        GET({ taskResultId: submission.id }, 'taskresource/marks/by/testResult', {})
            .then(res => {
                setMarkData(res.data);
                form.setFieldsValue({
                    markValue: res.data.markValue,
                    comment: res.data.comment
                });
            })
            .catch(() => {
                setMarkData(null);
                form.resetFields();
            });
    }, [visible, submission, GET, form]);

    const handleSave = values => {
        const payload = {
            id: markData?.id || '',
            taskResultId: submission.id,
            userId: submission.student.id,
            markValue: values.markValue,
            comment: values.comment
        };
        const url = markData
            ? `taskresource/marks/${markData.id}`
            : 'taskresource/marks';
        PUT({}, url, {}, payload)
            .then(() => {
                message.success('Review saved');
                onClose();
            })
            .catch(() => message.error('Failed to save review'));
    };

    return (
        <Modal
            visible={visible}
            title="Review Submission"
            onCancel={onClose}
            footer={null}
            width={700}
            bodyStyle={{ padding: 24 }}
        >
            <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Student">
                    <Avatar src={submission.student.imageUrl} style={{ marginRight: 8 }} />
                    {submission.student.firstName} {submission.student.lastName}
                    <div><Text type="secondary">{submission.student.contactEmail}</Text></div>
                </Descriptions.Item>
                <Descriptions.Item label="Submitted At">
                    {moment(submission.completionTime).format('LLLL')}
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={files}
                renderItem={file => (
                    <List.Item>
                        <Card size="small" hoverable>
                            <FileOutlined style={{ marginRight: 8 }} />
                            <a href={file.driveUrl} target="_blank" rel="noopener noreferrer">
                                {file.originalName}
                            </a>
                        </Card>
                    </List.Item>
                )}
            />

            <Divider />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={{ markValue: null, comment: '' }}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label={`Mark (0 – ${taskMaxMark})`}
                            name="markValue"
                            rules={[
                                { required: true, message: 'Please enter a mark' },
                                {
                                    type: 'number',
                                    max: taskMaxMark,
                                    message: `Cannot exceed max (${taskMaxMark})`
                                }
                            ]}
                        >
                            <InputNumber
                                min={0}
                                max={taskMaxMark}
                                formatter={val => `${val}/${taskMaxMark}`}
                                parser={val => val.replace(`/${taskMaxMark}`, '')}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            label="Comment"
                            name="comment"
                            rules={[{ required: true, message: 'Please add your feedback' }]}
                        >
                            <Input.TextArea rows={3} placeholder="Your feedback…" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item style={{ textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Submit Review
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const TaskDetailsCard = ({ task, onUpdate, onDelete }) => {
    const { PUT, DELETE, GET, FilePost } = useHttp();
    const currentUser = useSelector(state => state.users.user);

    // Details tab state
    const [editing, setEditing] = useState(false);
    const [fileDetails, setFileDetails] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [addFileModalOpen, setAddFileModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [form] = Form.useForm();

    // Submissions tab state
    const [activeTab, setActiveTab] = useState('details');
    const [submissions, setSubmissions] = useState([]);
    const [studentsMap, setStudentsMap] = useState({});
    const [loadingSubs, setLoadingSubs] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Load attached files
    useEffect(() => {
        if (!task?.attachedFiles?.length) return setFileDetails([]);
        const q = task.attachedFiles.map(id => `files=${id}`).join('&');
        setLoadingFiles(true);
        GET({}, `fileresource/files/defined?${q}`, {})
            .then(res => setFileDetails(res.data))
            .catch(() => message.error('Failed to load files'))
            .finally(() => setLoadingFiles(false));
    }, [task, GET]);

    // Prefill edit form
    useEffect(() => {
        if (editing && task) {
            form.setFieldsValue({
                name: task.name,
                description: task.description,
                maxMarkValue: task.maxMarkValue,
                deadline: moment(task.deadline)
            });
        }
    }, [editing, task, form]);

    // Fetch submissions when tab activated
    useEffect(() => {
        if (activeTab === 'submissions') fetchSubmissions();
    }, [activeTab, task]);

    const fetchSubmissions = async () => {
        setLoadingSubs(true);
        try {
            const res = await GET({ taskId: task.id }, 'taskresource/taskResult/by/task', {});
            const results = res.data;
            setSubmissions(results);

            const ids = [...new Set(results.map(r => r.studentId))];
            if (ids.length) {
                const query = ids.map(id => `ids=${id}`).join('&');
                const usersRes = await GET({}, `userdataresource/users/by-ids?${query}`, {});
                const map = {};
                usersRes.data.forEach(u => (map[u.id] = u));
                setStudentsMap(map);
            }
        } catch {
            message.error('Failed to load submissions');
        } finally {
            setLoadingSubs(false);
        }
    };

    const openSubmissionModal = submission => {
        setSelectedSubmission({
            ...submission,
            student: studentsMap[submission.studentId]
        });
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        fetchSubmissions();
    };

    // Detail handlers...
    const handleDeleteFile = async file => {
        try {
            const updated = {
                ...task,
                attachedFiles: task.attachedFiles.filter(id => id !== file.id),
                authorId: currentUser.id
            };
            await PUT({}, `taskresource/tasks/${task.id}`, {}, updated);
            onUpdate(updated);
            message.success('File removed');
        } catch {
            message.error('Failed to remove file');
        }
    };

    const handleUpdate = async values => {
        const updated = {
            ...task,
            ...values,
            deadline: values.deadline.format('YYYY-MM-DD'),
            createdAt: task.createdAt,
            authorId: currentUser.id
        };
        await PUT({}, `taskresource/tasks/${task.id}`, {}, updated);
        onUpdate(updated);
        setEditing(false);
        message.success('Task updated');
    };

    const handleDeleteTask = () => {
        Modal.confirm({
            title: 'Delete this task?',
            onOk: async () => {
                await DELETE({}, `taskresource/tasks/${task.id}`, {});
                onDelete(task.id);
                message.success('Task deleted');
            }
        });
    };

    const customRequest = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        try {
            const res = await FilePost('fileresource/files', formData);
            setUploadedFiles(prev => [...prev, { ...file, response: res.data }]);
            message.success(`${file.name} uploaded`);
            onSuccess();
        } catch (err) {
            message.error(`Upload failed: ${file.name}`);
            onError(err);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveUpload = file => {
        setUploadedFiles(prev => prev.filter(f => f.uid !== file.uid));
    };

    const handleSaveFiles = async () => {
        const ids = uploadedFiles.map(f => f.response.id);
        const updated = {
            ...task,
            attachedFiles: [...task.attachedFiles, ...ids],
            authorId: currentUser.id
        };
        try {
            await PUT({}, `taskresource/tasks/${task.id}`, {}, updated);
            onUpdate(updated);
            message.success('Files added');
            setAddFileModalOpen(false);
            setUploadedFiles([]);
        } catch {
            message.error('Failed to add files');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card
                className="shadow-md rounded-2xl"
                title={<Title level={4}>{task.name}</Title>}
                extra={[
                    iconButton('Edit', <EditOutlined />, () => setEditing(true)),
                    iconButton('Delete', <DeleteOutlined />, handleDeleteTask, true)
                ]}
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Details" key="details">
                        <Row gutter={16} className="mb-4">
                            <Col span={12}>
                                <Text strong>Created:</Text> {moment(task.createdAt).format('LLL')}
                            </Col>
                            <Col span={12}>
                                <Text strong>Deadline:</Text> {moment(task.deadline).format('LL')}
                            </Col>
                            <Col span={12}>
                                <Text strong>Max Mark:</Text> {task.maxMarkValue}
                            </Col>
                        </Row>
                        <Divider>Description</Divider>
                        <Text>{task.description}</Text>
                        <Divider>Files</Divider>
                        <Button icon={<PlusOutlined />} block onClick={() => setAddFileModalOpen(true)} className="mb-4">
                            Add File
                        </Button>
                        <List
                            loading={loadingFiles}
                            dataSource={fileDetails}
                            renderItem={file => (
                                <List.Item
                                    actions={[
                                        <Button type="link" href={file.driveUrl} target="_blank" icon={<EyeOutlined />} />,
                                        <Button type="link" onClick={() => handleDeleteFile(file)} danger>
                                            Remove
                                        </Button>
                                    ]}
                                >
                                    <FileOutlined style={{ marginRight: 8 }} />
                                    {file.originalName}{' '}
                                    <Text type="secondary">
                                        ({file.size} • {moment(file.uploadedAt).format('LLL')})
                                    </Text>
                                </List.Item>
                            )}
                        />
                    </TabPane>

                    <TabPane tab="Submissions" key="submissions">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchSubmissions}
                            loading={loadingSubs}
                            style={{ marginBottom: 16 }}
                        >
                            Refresh
                        </Button>
                        <List
                            loading={loadingSubs}
                            itemLayout="horizontal"
                            dataSource={submissions}
                            renderItem={item => {
                                const student = studentsMap[item.studentId] || {};
                                return (
                                    <List.Item actions={[<Button onClick={() => openSubmissionModal(item)}>Review</Button>]}>
                                        <List.Item.Meta
                                            title={`${student.firstName || ''} ${student.lastName || ''}`}
                                            description={student.contactEmail}
                                        />
                                        <div>
                                            {item.completed ? 'Completed' : 'Incomplete'} •{' '}
                                            {moment(item.completionTime).format('LLL')}
                                        </div>
                                    </List.Item>
                                );
                            }}
                        />
                    </TabPane>
                </Tabs>
            </Card>

            {selectedSubmission && (
                <TaskResultModal
                    visible={modalVisible}
                    onClose={closeModal}
                    submission={selectedSubmission}
                    taskMaxMark={task.maxMarkValue}
                />
            )}

            {/* Edit Task Modal */}
            <Modal
                title="Edit Task"
                visible={editing}
                onCancel={() => setEditing(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    <Form.Item name="name" label="Task Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="maxMarkValue" label="Max Mark Value" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Add File Modal */}
            <Modal
                title="Upload File"
                visible={addFileModalOpen}
                onCancel={() => setAddFileModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setAddFileModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSaveFiles}
                        loading={uploading}
                        disabled={uploadedFiles.length === 0}
                    >
                        Save Files
                    </Button>
                ]}
                destroyOnClose
            >
                <Upload.Dragger
                    name="file"
                    customRequest={customRequest}
                    fileList={uploadedFiles}
                    onRemove={handleRemoveUpload}
                    showUploadList={{
                        showRemoveIcon: true,
                        showDownloadIcon: false,
                        showPreviewIcon: false
                    }}
                    onPreview={async file => {
                        if (file.response?.id) {
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
            </Modal>
        </motion.div>
    );
};

export default TaskDetailsCard;
