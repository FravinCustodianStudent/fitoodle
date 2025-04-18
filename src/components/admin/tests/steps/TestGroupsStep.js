import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Modal,
    Drawer,
    Form,
    Input,
    Checkbox,
    Col,
    Row,
    Steps,
    List,
    Popconfirm,
    message,
    Avatar,
    Upload,
} from 'antd';
import {
    FolderOpenOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FileTextOutlined,
    PlusCircleOutlined,
    LoadingOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { useHttp } from '../../../../hooks/http.hook';

const { Step } = Steps;
const { Meta } = Card;

// Helpers for Google Drive thumbnail URLs
function getDriveFileId(url) {
    const m = url.match(/\/d\/([^/]+)\//);
    return m ? m[1] : null;
}
function getDriveThumbnailUrl(url) {
    const id = getDriveFileId(url);
    return id ? `https://drive.google.com/thumbnail?id=${id}` : url;
}
// Deduplicate a fileList array by uid
const dedupByUid = fileList =>
    Array.from(new Map(fileList.map(f => [f.uid, f])).values());

const TestGroupsStep = ({ onBack, onNext }) => {
    const { GET, POST, PUT, DELETE, FilePost } = useHttp();

    // ─── State ─────────────────────────────────────────────
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [groupModalVisible, setGroupModalVisible] = useState(false);
    const [groupForm] = Form.useForm();
    const [editingGroup, setEditingGroup] = useState(null);

    const [questionDrawerVisible, setQuestionDrawerVisible] = useState(false);
    const [questionStep, setQuestionStep] = useState(0);
    const [questionForm] = Form.useForm();
    const [uploadedQuestionFile, setUploadedQuestionFile] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const [removingFileIds, setRemovingFileIds] = useState([]);

    // ─── Load groups ──────────────────────────────────────
    useEffect(() => {
        GET({}, 'testingresource/questionGroups', {})
            .then(res => setGroups(res.data))
            .catch(() => message.error('Failed to load groups'));
    }, [GET]);

    // ─── Load questions for a selected group ──────────────
    useEffect(() => {
        if (!selectedGroup) return;
        GET(
            { questionGroupId: selectedGroup.id },
            'testingresource/questions/by/questionGroup',
            {}
        )
            .then(res =>
                setSelectedGroup(g => ({ ...g, questions: res.data }))
            )
            .catch(() => message.error('Failed to load questions'));
    }, [selectedGroup?.id, GET]);

    // ─── Prepare question drawer ─────────────────────────
    useEffect(() => {
        if (!questionDrawerVisible) return;
        if (editingQuestion) {
            questionForm.setFieldsValue({
                name: editingQuestion.name,
                questionText: editingQuestion.questionText,
            });
            setUploadedQuestionFile(
                editingQuestion.attachmentUrl
                    ? [{
                        uid: 'init',
                        name: 'attachment',
                        status: 'done',
                        percent: 100,
                        response: { id: getDriveFileId(editingQuestion.attachmentUrl),
                            driveUrl: editingQuestion.attachmentUrl},
                        url: getDriveThumbnailUrl(editingQuestion.attachmentUrl),
                    }]
                    : []
            );
            setAnswers(
                editingQuestion.answers.map(a => ({
                    id: a.id,
                    text: a.text,
                    correct: a.correct,
                    _file: a.attachmentUrl
                        ? [{
                            uid: a.id,
                            name: a.text,
                            status: 'done',
                            percent: 100,
                            response: { id: getDriveFileId(a.attachmentUrl) },
                            url: getDriveThumbnailUrl(a.attachmentUrl),
                        }]
                        : []
                }))
            );
        } else {
            questionForm.resetFields();
            setUploadedQuestionFile([]);
            setAnswers([
                { text: '', correct: false, _file: [] },
                { text: '', correct: false, _file: [] },
            ]);
        }
        setQuestionStep(0);
    }, [questionDrawerVisible, editingQuestion, questionForm]);

    // ─── File upload helpers ──────────────────────────────
    const beforeUpload = file => {
        if (uploadedQuestionFile.length >= 1) {
            message.warning('Only one file allowed');
            return Upload.LIST_IGNORE;
        }
        const ok = file.size / 1024 / 1024 < 2;
        if (!ok) message.error('File must be ≤ 2MB');
        return ok;
    };

    const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
        setUploadedQuestionFile(prev => [
            ...prev,
            { uid: file.uid, name: file.name, status: 'uploading', percent: 0 }
        ]);

        const formData = new FormData();
        formData.append('file', file);

        let percent = 0;
        const fake = setInterval(() => {
            percent += 10;
            onProgress({ percent }, file);
            setUploadedQuestionFile(p =>
                p.map(f => f.uid === file.uid ? { ...f, percent } : f)
            );
            if (percent >= 90) clearInterval(fake);
        }, 100);

        try {
            const res = await FilePost('fileresource/files', formData);
            clearInterval(fake);
            setUploadedQuestionFile(p =>
                p.map(f =>
                    f.uid === file.uid
                        ? { ...f, status: 'done', percent: 100, response: res.data, url: res.data.driveUrl }
                        : f
                )
            );
            onSuccess(res.data, file);
            message.success(`${file.name} uploaded`);
        } catch {
            clearInterval(fake);
            setUploadedQuestionFile(p =>
                p.map(f => f.uid === file.uid ? { ...f, status: 'error', percent: 100 } : f)
            );
            onError(new Error('Upload error'));
            message.error(`Upload failed`);
        }
    };

    const handleRemoveFile = async file => {
        setRemovingFileIds(ids => [...ids, file.uid]);
        try {
            await DELETE({}, `fileresource/files/${file.response.id}`, {});
            setUploadedQuestionFile(p => p.filter(f => f.uid !== file.uid));
            message.success(`${file.name} removed`);
        } catch {
            message.error('Failed to remove file');
        } finally {
            setRemovingFileIds(ids => ids.filter(id => id !== file.uid));
        }
        return true;
    };

    // ─── Group CRUD ───────────────────────────────────────
    const openGroupModal = g => {
        setEditingGroup(g);
        groupForm.setFieldsValue(g ? { name: g.name } : { name: '' });
        setGroupModalVisible(true);
    };

    const handleGroupSubmit = async () => {
        let vals;
        try {
            vals = await groupForm.validateFields();
        } catch {
            return;
        }
        const { name } = vals;

        if (editingGroup) {
            try {
                await PUT({ name }, `testingresource/questionGroups/${editingGroup.id}`, {}, {});
                const updated = { ...editingGroup, name };
                setGroups(g => g.map(x => x.id === updated.id ? updated : x));
                if (selectedGroup?.id === updated.id) setSelectedGroup(updated);
                message.success('Group updated');
            } catch {
                message.error('Failed to update group');
            }
        } else {
            try {
                const res = await POST({ name }, 'testingresource/questionGroups', {}, {});
                setGroups(g => [...g, res.data]);
                setSelectedGroup(res.data);
                message.success('Group created');
            } catch {
                message.error('Failed to create group');
            }
        }
        setGroupModalVisible(false);
    };

    const handleDeleteGroup = async id => {
        try {
            await DELETE({}, `testingresource/questionGroups/${id}`, {});
            setGroups(g => g.filter(x => x.id !== id));
            if (selectedGroup?.id === id) setSelectedGroup(null);
            message.success('Group deleted');
        } catch {
            message.error('Failed to delete group');
        }
    };

    // ─── Question CRUD ────────────────────────────────────
    const openQuestionDrawer = q => {
        setEditingQuestion(q);
        setQuestionDrawerVisible(true);
    };

    const handleQuestionNext = async () => {
        try {
            await questionForm.validateFields(['name', 'questionText']);
            setQuestionStep(1);
        } catch {
            // errors shown automatically
        }
    };

    // ← updated → pull name/questionText via validateFields
    const handleQuestionSave = async () => {
        let vals;
        try {
            vals = await questionForm.validateFields(['name', 'questionText']);
        } catch {
            return; // fields invalid
        }

        const { name, questionText } = vals;

        const filled = answers.filter(a => a.text.trim());
        if (filled.length < 2 || filled.length > 4) {
            return message.error('Provide between 2 and 4 answers');
        }

        const questionAnswers = filled.map(a => {
            const oldAnswer = editingQuestion?.answers?.find(x => x.id === a.id);

            return {
                id: a.id || crypto.randomUUID(),
                text: a.text,
                correct: a.correct,
                attachmentUrl:
                    a._file[0]?.response?.driveUrl || // uploaded
                    oldAnswer?.attachmentUrl ||       // fallback to previous
                    null                              // if no file at all
            };
        });

        const payload = {
            name,
            questionText,
            questionGroupId: selectedGroup.id,
            attachmentUrl:
                uploadedQuestionFile[0]?.response?.driveUrl ||
                editingQuestion?.attachmentUrl ||
                null,
            answers: questionAnswers,
        };

        if (editingQuestion) {
            try {
                await PUT({}, `testingresource/questions/${editingQuestion.id}`, {}, payload);
                setSelectedGroup(g => ({
                    ...g,
                    questions: g.questions.map(q =>
                        q.id === editingQuestion.id ? { ...payload, id: editingQuestion.id } : q
                    ),
                }));
                message.success('Question updated');
            } catch {
                message.error('Failed to update question');
            }
        } else {
            try {
                const res = await POST({}, 'testingresource/questions', {}, payload);
                setSelectedGroup(g => ({
                    ...g,
                    questions: [...(g.questions || []), res.data],
                }));
                message.success('Question created');
            } catch {
                message.error('Failed to create question');
            }
        }

        setQuestionDrawerVisible(false);
    };

    const addAnswer = () => setAnswers(a => [...a, { text: '', correct: false, _file: [] }]);
    const removeAnswer = i => setAnswers(a => a.filter((_, idx) => idx !== i));
    const handleAnswerChange = (i, key, val) =>
        setAnswers(a => a.map((x, idx) => (idx === i ? { ...x, [key]: val } : x)));

    const handleDeleteQuestion = async id => {
        try {
            await DELETE({}, `testingresource/questions/${id}`, {});
            setSelectedGroup(g => ({
                ...g,
                questions: g.questions.filter(q => q.id !== id),
            }));
            message.success('Question deleted');
        } catch {
            message.error('Failed to delete question');
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Button onClick={onBack}>← Back</Button>
                <Button type="primary" onClick={onNext}>Next →</Button>
            </div>

            <Row gutter={16}>
                <Col span={8}>
                    <Card
                        title="Question Groups"
                        extra={<Button icon={<PlusOutlined />} onClick={() => openGroupModal(null)}>Add Group</Button>}
                        bordered={false}
                    >
                        <List
                            rowKey="id"
                            bordered
                            dataSource={groups}
                            renderItem={g => (
                                <List.Item
                                    key={g.id}
                                    style={{
                                        background: selectedGroup?.id === g.id ? '#e6f7ff' : undefined,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setSelectedGroup(g)}
                                    actions={[
                                        <EditOutlined onClick={e => { e.stopPropagation(); openGroupModal(g); }} />,
                                        <Popconfirm title="Delete?" onConfirm={() => handleDeleteGroup(g.id)}>
                                            <DeleteOutlined />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <FolderOpenOutlined style={{ marginRight: 8 }} />{g.name}
                                </List.Item>
                            )}
                            locale={{ emptyText: 'No groups created' }}
                        />
                    </Card>
                </Col>

                <Col span={16}>
                    {selectedGroup ? (
                        <Card
                            title={<><FolderOpenOutlined style={{ marginRight: 8 }} />{selectedGroup.name}</>}
                            extra={<Button icon={<PlusOutlined />} onClick={() => openQuestionDrawer(null)}>Add Question</Button>}
                            bordered={false}
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                {(selectedGroup.questions || []).map(q => (
                                    <Card
                                        key={q.id}
                                        style={{ width: 300 }}
                                        cover={q.attachmentUrl && (
                                            <img alt={q.name} src={getDriveThumbnailUrl(q.attachmentUrl)} style={{ maxWidth: '100%' }} />
                                        )}
                                        actions={[
                                            <EditOutlined onClick={() => openQuestionDrawer(q)} />,
                                            <Popconfirm title="Delete?" onConfirm={() => handleDeleteQuestion(q.id)}>
                                                <DeleteOutlined />
                                            </Popconfirm>,
                                        ]}
                                    >
                                        <Meta
                                            avatar={<Avatar icon={<FileTextOutlined />} />}
                                            title={q.name}
                                            description={q.questionText}
                                        />
                                    </Card>
                                ))}
                            </div>
                        </Card>
                    ) : (
                        <Card bordered={false}><p>Select a group to view questions.</p></Card>
                    )}
                </Col>
            </Row>

            <Modal
                visible={groupModalVisible}
                title={editingGroup ? 'Edit Group' : 'Create Group'}
                onCancel={() => setGroupModalVisible(false)}
                onOk={handleGroupSubmit}
            >
                <Form form={groupForm} layout="vertical">
                    <Form.Item name="name" label="Group Name" rules={[{ required: true, message: 'Enter a name' }]}>
                        <Input placeholder="Group name" />
                    </Form.Item>
                </Form>
            </Modal>

            <Drawer
                title={editingQuestion ? 'Edit Question' : 'Create Question'}
                width={600}
                visible={questionDrawerVisible}
                onClose={() => setQuestionDrawerVisible(false)}
                destroyOnClose
                footer={(
                    <div style={{ textAlign: 'right' }}>
                        {questionStep === 0
                            ? <Button type="primary" onClick={handleQuestionNext}>Next</Button>
                            : <>
                                <Button onClick={() => setQuestionStep(0)} style={{ marginRight: 8 }}>Back</Button>
                                <Button type="primary" onClick={handleQuestionSave}>Save</Button>
                            </>}
                    </div>
                )}
            >
                <Steps current={questionStep} size="small" style={{ marginBottom: 24 }}>
                    <Step title="Basic Info" />
                    <Step title="Answers" />
                </Steps>

                {questionStep === 0 && (
                    <Form form={questionForm} layout="vertical">
                        <Form.Item name="name" label="Question Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="questionText" label="Question Text" rules={[{ required: true }]}>
                            <Input.TextArea rows={3} />
                        </Form.Item>
                        <Form.Item label="Attach File">
                            <Upload.Dragger
                                name="file"
                                customRequest={customRequest}
                                beforeUpload={beforeUpload}
                                fileList={uploadedQuestionFile}
                                onChange={({ fileList }) => setUploadedQuestionFile(dedupByUid(fileList))}
                                onRemove={handleRemoveFile}
                                maxCount={1}
                                listType="picture"
                                showUploadList={{
                                    showRemoveIcon: true,
                                    removeIcon: file =>
                                        removingFileIds.includes(file.uid)
                                            ? <LoadingOutlined spin />
                                            : <DeleteOutlined />,
                                }}
                            >
                                {uploadedQuestionFile.length === 0 ? (
                                    <>
                                        <p className="ant-upload-drag-icon"><PlusCircleOutlined /></p>
                                        <p className="ant-upload-text">Click or drag file to upload</p>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: 16 }}>
                                        <StopOutlined style={{ fontSize: 24, color: '#f5222d' }} />
                                        <p>You have reached the maximum file quantity</p>
                                    </div>
                                )}
                            </Upload.Dragger>
                        </Form.Item>
                    </Form>
                )}

                {questionStep === 1 && (
                    <>
                        {answers.map((ans, idx) => (
                            <Card
                                key={ans.id || idx}
                                type="inner"
                                title={`Answer ${idx + 1}`}
                                style={{ marginBottom: 12 }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <Input
                                        placeholder="Answer text"
                                        value={ans.text}
                                        onChange={e => handleAnswerChange(idx, 'text', e.target.value)}
                                    />
                                    <Checkbox
                                        checked={ans.correct}
                                        onChange={e => handleAnswerChange(idx, 'correct', e.target.checked)}
                                    >
                                        Correct
                                    </Checkbox>
                                    <Upload
                                        name="file"
                                        customRequest={customRequest}
                                        beforeUpload={file => {
                                            if (ans._file.length >= 1) {
                                                message.warning('Only one file allowed');
                                                return Upload.LIST_IGNORE;
                                            }
                                            const ok = file.size / 1024 / 1024 < 2;
                                            if (!ok) message.error('File must be ≤ 2MB');
                                            return ok;
                                        }}
                                        fileList={ans._file}
                                        onChange={({ fileList }) => handleAnswerChange(idx, '_file', dedupByUid(fileList))}
                                        onRemove={file => handleRemoveFile(file)}
                                        maxCount={1}
                                        listType="picture"
                                        showUploadList={{
                                            showRemoveIcon: true,
                                            removeIcon: file =>
                                                removingFileIds.includes(file.uid)
                                                    ? <LoadingOutlined spin />
                                                    : <DeleteOutlined />,
                                        }}
                                    >
                                        {ans._file.length === 0 && (
                                            <Button icon={<PlusOutlined />}>Attach File</Button>
                                        )}
                                    </Upload>
                                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                                        <Button
                                            type="dashed"
                                            icon={<PlusOutlined />}
                                            onClick={addAnswer}
                                            disabled={answers.length >= 4}
                                        >
                                            Add Answer
                                        </Button>
                                        {answers.length > 2 && (
                                            <Button type="link" danger onClick={() => removeAnswer(idx)}>
                                                Remove Answer
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </>
                )}
            </Drawer>
        </>
    );
};

export default TestGroupsStep;
