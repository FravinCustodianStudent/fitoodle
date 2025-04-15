import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    Card,
    Typography,
    Row,
    Col,
    Divider,
    Tooltip,
    Upload,
    Button,
    List,
    Modal,
    Form,
    Input,
    DatePicker,
    message
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    FileOutlined,
    PlusOutlined,
    EyeOutlined,
    SaveOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useHttp } from '../../../hooks/http.hook';

const { Title, Text } = Typography;

const iconButton = (title, icon, onClick, danger = false) => (
    <Tooltip title={title}>
        <Button type="text" icon={icon} onClick={onClick} danger={danger} />
    </Tooltip>
);

const TaskDetailsCard = ({ task, onUpdate, onDelete }) => {
    const { PUT, DELETE, GET, FilePost } = useHttp();
    const currentUser = useSelector((state) => state.users.user);
    const [form] = Form.useForm();
    const [editing, setEditing] = useState(false);
    const [fileDetails, setFileDetails] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [addFileModalOpen, setAddFileModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        if (task?.attachedFiles?.length) {
            const query = task.attachedFiles.map(id => `files=${id}`).join('&');
            setLoadingFiles(true);
            GET({}, `fileresource/files/defined?${query}`, {})
                .then(res => setFileDetails(res.data))
                .catch(() => message.error('Failed to load file info'))
                .finally(() => setLoadingFiles(false));
        } else {
            setFileDetails([]);
        }
    }, [task, GET]);

    useEffect(() => {
        if (editing && task) {
            form.setFieldsValue({
                name: task.name,
                description: task.description,
                maxMarkValue: task.maxMarkValue,
                deadline: task.deadline ? moment(task.deadline) : null
            });
        }
    }, [editing, task, form]);

    const handleDeleteFile = async (fileId) => {
        try {
            const updated = {
                ...task,
                attachedFiles: task.attachedFiles.filter(id => id !== fileId),
                authorId: currentUser.id
            };
            await PUT({}, `taskresource/tasks/${task.id}`, {}, updated);
            onUpdate(updated);
            message.success('File removed from task');
        } catch {
            message.error('Failed to update task');
        }
    };

    const handleUpdate = async (values) => {
        const updated = {
            ...task,
            ...values,
            deadline: values.deadline.format('YYYY-MM-DD'),
            createdAt: moment(task.createdAt).format('YYYY-MM-DDTHH:mm:ss'),
            authorId: currentUser.id
        };
        await PUT({}, `taskresource/tasks/${task.id}`, {}, updated);
        onUpdate(updated);
        setEditing(false);
        message.success('Task updated');
    };

    const handleDeleteTask = async () => {
        Modal.confirm({
            title: 'Are you sure you want to delete this task?',
            okText: 'Yes',
            cancelText: 'No',
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
            const newFile = {
                uid: file.uid,
                name: file.name,
                status: 'done',
                response: res.data
            };
            setUploadedFiles(prev => [...prev, newFile]);
            message.success(`${file.name} uploaded`);
            onSuccess();
        } catch (err) {
            message.error(`Upload failed: ${file.name}`);
            onError(err);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = async (file) => {
        setUploadedFiles(prev => prev.filter(f => f.uid !== file.uid));
    };

    const handleSaveFiles = async () => {
        const fileIds = uploadedFiles.map((file) => file.response.id);
        const updated = {
            ...task,
            attachedFiles: [...task.attachedFiles, ...fileIds],
            authorId: currentUser.id
        };
        try {
            await PUT({}, `taskresource/tasks/${task.id}`, {}, updated);
            onUpdate(updated);
            message.success('Files added to task');
            setAddFileModalOpen(false);
            setUploadedFiles([]);
        } catch {
            message.error('Failed to update task with new files');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card
                className="shadow-md rounded-2xl"
                title={<Title level={4}>{task.name}</Title>}
                extra={[
                    iconButton('Edit', <EditOutlined />, () => setEditing(true)),
                    iconButton('Delete', <DeleteOutlined />, handleDeleteTask, true)
                ]}
            >
                <Row gutter={16} className="mb-4">
                    <Col span={12}><Text strong>Created:</Text> {moment(task.createdAt).format('LLL')}</Col>
                    <Col span={12}><Text strong>Deadline:</Text> {moment(task.deadline).format('LL')}</Col>
                    <Col span={12}><Text strong>Max Mark:</Text> {task.maxMarkValue}</Col>
                </Row>

                <Divider>Description</Divider>
                <Text>{task.description}</Text>

                <Divider>Files</Divider>
                <Button icon={<PlusOutlined />} block onClick={() => setAddFileModalOpen(true)}>
                    Add File
                </Button>

                <List
                    loading={loadingFiles}
                    dataSource={fileDetails}
                    renderItem={(file) => (
                        <List.Item
                            actions={[
                                <Button type="primary" href={file.driveUrl} target="_blank" icon={<EyeOutlined />} />,
                                <Button key="remove" type="primary" onClick={() => handleDeleteFile(file.id)}>Remove</Button>
                            ]}
                        >
                            <div>
                                <div><FileOutlined style={{ marginRight: 8 }} />Name: ({file.originalName})</div>
                                <div><Text type="secondary">{file.size} • Uploaded: {moment(file.uploadedAt).format('LLL')}</Text></div>
                            </div>
                        </List.Item>
                    )}
                />

                <Modal
                    title="Edit Task"
                    open={editing}
                    onCancel={() => setEditing(false)}
                    onOk={() => form.submit()}
                    destroyOnClose
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                    >
                        <Form.Item name="name" label="Task Name" rules={[{ required: true }]}> <Input /> </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true }]}> <Input.TextArea rows={3} /> </Form.Item>
                        <Form.Item name="maxMarkValue" label="Max Mark Value" rules={[{ required: true }]}> <Input type="number" /> </Form.Item>
                        <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}> <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" /> </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Upload File"
                    open={addFileModalOpen}
                    onCancel={() => setAddFileModalOpen(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setAddFileModalOpen(false)}>Cancel</Button>,
                        <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={handleSaveFiles} loading={uploading} disabled={uploadedFiles.length === 0}>Save Files</Button>
                    ]}
                    destroyOnClose
                >
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
                </Modal>
            </Card>
        </motion.div>
    );
};

export default TaskDetailsCard;