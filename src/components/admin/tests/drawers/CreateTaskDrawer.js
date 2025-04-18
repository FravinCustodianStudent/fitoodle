import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, DatePicker, Upload, Button, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useHttp } from "../../../../hooks/http.hook";

const CreateTaskDrawer = ({
                              visible,
                              onClose,
                              selectedCourse,
                              editingTask,
                              onCreate,
                              onUpdate,
                          }) => {
    const { FilePost, DELETE, POST, GET } = useHttp();
    const currentUser = useSelector((state) => state.users.user);
    const [form] = Form.useForm();
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // When drawer opens, reset or populate form
    useEffect(() => {
        if (visible) {
            if (editingTask) {
                form.setFieldsValue({
                    name: editingTask.name,
                    maxMarkValue: editingTask.maxMarkValue,
                    createdAt: moment(editingTask.createdAt),
                    deadline: moment(editingTask.deadline),
                    description: editingTask.description,
                });
                if (editingTask.attachedFiles?.length) {
                    const list = editingTask.attachedFiles.map((f) => ({
                        uid: f.id,
                        name: f.name,
                        status: 'done',
                        response: { id: f.id },
                    }));
                    setUploadedFiles(list);
                }
            } else {
                form.resetFields();
                setUploadedFiles([]);
                form.setFieldsValue({ createdAt: moment() });
            }
        }
    }, [visible, editingTask, form]);

    const beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) message.error('File must be smaller than 2MB!');
        return isLt2M;
    };

    const customRequest = async ({ file, onSuccess, onError }) => {
        const newFile = { uid: file.uid, name: file.name, status: 'uploading', percent: 0 };
        setUploadedFiles((prev) => [...prev, newFile]);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await FilePost('fileresource/files', formData);
            setUploadedFiles((prev) =>
                prev.map((f) =>
                    f.uid === file.uid
                        ? { ...f, status: 'done', percent: 100, response: res.data }
                        : f
                )
            );
            onSuccess(res.data, file);
            message.success(`${file.name} uploaded`);
        } catch (err) {
            setUploadedFiles((prev) =>
                prev.map((f) =>
                    f.uid === file.uid ? { ...f, status: 'error', percent: 100 } : f
                )
            );
            onError(err);
            message.error(`Upload failed: ${file.name}`);
        }
    };

    const handleRemove = async (file) => {
        try {
            await DELETE({}, `fileresource/files/${file.response.id}`, {});
            setUploadedFiles((prev) => prev.filter((f) => f.uid !== file.uid));
            message.success(`${file.name} removed`);
        } catch {
            message.error('Failed to remove file');
        }
    };

    const handleFinish = (values) => {
        const payload = {
            id: editingTask ? editingTask.id : Date.now().toString(),
            name: values.name,
            authorId: currentUser.id,
            eduCourseId: selectedCourse?.id,
            maxMarkValue: values.maxMarkValue,
            createdAt: values.createdAt.format('YYYY-MM-DDTHH:mm:ss'),
            deadline: values.deadline.format('YYYY-MM-DD'),
            description: values.description,
            attachedFiles: uploadedFiles.map((f) => f.response.id),
            testId: editingTask?.testId || null,
        };

        POST({}, 'taskresource/tasks', {}, payload)
            .then((res) => {
                editingTask ? onUpdate(res.data) : onCreate(res.data);
                message.success(editingTask ? 'Task updated' : 'Task created');
                onClose();
            })
            .catch(() => message.error('Failed to save task'));
    };

    return (
        <Drawer
            title={editingTask ? 'Edit Task' : 'Create Task'}
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
                        multiple
                        customRequest={customRequest}
                        fileList={uploadedFiles}
                        beforeUpload={beforeUpload}
                        onRemove={handleRemove}
                        onPreview={async (file) => {
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
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        <PlusCircleOutlined /> {editingTask ? 'Update Task' : 'Create Task'}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default CreateTaskDrawer;