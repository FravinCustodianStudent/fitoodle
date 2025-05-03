import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Input, List, Button, Table, Drawer, Form, Checkbox,
    Tooltip, Typography, Modal, Skeleton, Popover, message, Space, Flex, Divider
} from 'antd';
import {
    FilterOutlined, PlusOutlined, EditOutlined, SearchOutlined,
    CalendarOutlined, BookOutlined, UserOutlined, LinkOutlined,
    CheckCircleOutlined, ExperimentOutlined, ReloadOutlined, HddOutlined, NotificationOutlined, TeamOutlined
} from '@ant-design/icons';
import { format, startOfWeek, addDays } from 'date-fns';
import { useHttp } from '../../../hooks/http.hook';

const { Title } = Typography;

const timeSlots = [
    { start: '9:00', end: '10:20' },
    { start: '10:30', end: '11:50' },
    { start: '12:10', end: '13:30' },
    { start: '13:40', end: '15:00' },
    { start: '15:10', end: '16:30' },
    { start: '16:40', end: '18:00' },
    { start: '18:10', end: '19:30' },
];

const LessonSchedule = () => {
    const { GET, POST } = useHttp();

    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [tempSelectedGroup, setTempSelectedGroup] = useState(null);
    const [groupSearch, setGroupSearch] = useState('');
    const [filterParams, setFilterParams] = useState({});

    const [schedule, setSchedule] = useState([]);
    const [loadingSchedule, setLoadingSchedule] = useState(false);

    const [lessonDrawerVisible, setLessonDrawerVisible] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedRowSlot, setSelectedRowSlot] = useState(null)
    const [form] = Form.useForm();

    const [courses, setCourses] = useState([]);
    const [courseSearch, setCourseSearch] = useState('');
    const [courseDrawerVisible, setCourseDrawerVisible] = useState(false);

    const fetchGroups = (params = {}) => {
        GET(params, 'userdataresource/groups', {})
            .then(res => {

                setGroups(res.data)
            })
            .catch(console.error);
    };

    useEffect(() => { fetchGroups(); }, [GET]);

    useEffect(() => {
        if (selectedGroup) {
            setLoadingSchedule(true);
            GET({}, `scheduleresource/schedules/group/${selectedGroup.id}`, {})
                .then(res => {
                    const items = res.data.days.flatMap(day =>
                        (day.lessons || []).map(lsn => ({ ...lsn, dayOfWeek: day.dayOfWeek }))
                    );
                    setSchedule(items);
                })
                .then(res => {
                    GET({}, 'courseresource/courses/all', {})
                        .then(res => setCourses(res.data))
                        .catch(console.error);
                })
                .catch(console.error)
                .finally(() => setLoadingSchedule(false));

        }
    }, [selectedGroup, GET]);


    const filteredGroups = groups.filter(g => {
        const name = `${g.specNameShort} ${g.groupNumber} (${g.enterYear})`;
        return name.toLowerCase().includes(groupSearch.toLowerCase());
    });

    const filterContent = (
        <Form
            layout="vertical"
            onFinish={vals => { setFilterParams(vals); fetchGroups(vals); }}
            initialValues={filterParams}
        >
            <Form.Item label="Год поступления" name="enterYear">
                <Input type="number" placeholder="Год" prefix={<CalendarOutlined />} />
            </Form.Item>
            <Form.Item label="Специальность" name="specNameShort">
                <Input placeholder="Специальность" prefix={<BookOutlined />} />
            </Form.Item>
            <Form.Item label="Номер группы" name="groupNumber">
                <Input type="number" placeholder="Номер группы" prefix={<ReloadOutlined />} />
            </Form.Item>
            <Form.Item name="active" valuePropName="checked" label="Активные группы">
                <Checkbox><CheckCircleOutlined /> Активны</Checkbox>
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" size="small">Применить</Button>
                    <Button size="small" onClick={() => { setFilterParams({}); fetchGroups({}); }}>Сбросить</Button>
                </Space>
            </Form.Item>
        </Form>
    );

    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(weekStart, i + 1));

    const dataSource = timeSlots.map((slot, rowIdx) => {
        const row = { key: rowIdx, time: `${slot.start} - ${slot.end}`, slotIndex: rowIdx };
        //console.log(row);
        //console.log(schedule);
        weekDays.forEach((day, colIdx) => {
            row[day.toDateString()] =
                schedule.find(item => item.timeSlot === rowIdx+1  && item.dayOfWeek === colIdx + 1) || null;
        });
        return row;
    });

    const openLessonDrawer = (timeSlotIdx, lesson,collIdx) => {
        setSelectedTimeSlot(timeSlotIdx);
        setSelectedRowSlot(collIdx+1);
        setSelectedLesson(lesson);
        form.resetFields();
        if (lesson) form.setFieldsValue({
            id: lesson.id,
            eduItem: lesson.eduItem,
            teacher: lesson.teacher,
            conferenceUrl: lesson.conferenceUrl,
            practice: lesson.practice,
            shared: lesson.shared,
            timeSlot: lesson.timeSlot
        });
        else form.setFieldsValue({ practice: false, shared: false, timeSlot: timeSlotIdx+1 });
        setLessonDrawerVisible(true);
    };

    const onLessonFinish = values => {
        const dayOfWeek = selectedRowSlot;
        console.log(dayOfWeek);
        POST(
            {eduGroupId: selectedGroup.id,dayOfWeek:dayOfWeek},
            'scheduleresource/schedules/lesson',
            { },
            {
                id: values.id,
                eduItem: values.eduItem,
                teacher: values.teacher,
                conferenceUrl: values.conferenceUrl,
                practice: values.practice,
                shared: values.shared,
                timeSlot: values.timeSlot
            }
        )
            .then(() => {
                GET({}, `scheduleresource/schedules/group/${selectedGroup.id}`, {})
                    .then(res => {
                        setSchedule(res.data.days.flatMap(day =>
                            (day.lessons || []).map(lsn => ({ ...lsn, dayOfWeek: day.dayOfWeek }))
                        ))
                        message.success('Lesson saved')
                    })
            })
            .catch(() => message.error('Error on lesson creating'))
            .finally(() => setLessonDrawerVisible(false));
    };

    const filteredCourses = courses.filter(c => c.name.toLowerCase().includes(courseSearch.toLowerCase()));

    const columns = [
        { title: 'Time', dataIndex: 'time', key: 'time', fixed: 'left', width: 140, render: t => <><CalendarOutlined /> <strong>{t}</strong></> },
        ...weekDays.map((day, colIdx) => ({
            title: <strong>{format(day, 'EEEE')}</strong>,
            dataIndex: day.toDateString(),
            key: day.toDateString(),
            render: (lesson, record) => {
                const cellSlot = record.slotIndex;
                const collId= colIdx ;
                return lesson ? (
                    <Tooltip title="Edit Lesson">
                        <motion.div
                            onClick={() => openLessonDrawer(cellSlot, lesson,collId)}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                            }}
                            style={{
                                padding: 12,
                                marginBottom: 8,
                                cursor: 'pointer',
                                border: '1px solid #e8e8e8',
                                borderRadius: 8,
                                backgroundColor: '#ffffff',
                                transition: '0.2s'
                            }}
                        >
                            <Flex justify="center" vertical align="flex-start">
                                <Space size="small">
                                    <BookOutlined />
                                    <Typography.Text strong>Course:</Typography.Text>
                                    <Typography.Text>{lesson.eduItem}</Typography.Text>

                                </Space>
                                <Space size="small">
                                    <UserOutlined />
                                    <Typography.Text strong>Teacher:</Typography.Text>
                                    <Typography.Text>{lesson.teacher}</Typography.Text>
                                </Space>
                                <Divider></Divider>
                                <Space size="small">
                                    <NotificationOutlined />
                                    <Typography.Text>{lesson.practice ? 'Practice' : 'Lecture'}</Typography.Text>
                                    <TeamOutlined style={{ marginLeft: 12 }} />
                                    <Typography.Text>{lesson.shared ? 'Shared' : 'Private'}</Typography.Text>
                                </Space>
                            </Flex>
                        </motion.div>
                    </Tooltip>
                ) : (
                    <Tooltip title="Add Lesson">
                        <Button type="dashed" icon={<PlusOutlined />} onClick={() => openLessonDrawer(cellSlot, null,collId)}></Button>
                    </Tooltip>
                );
            }
        })),
    ];

    return (
        <div style={{ padding: 24,width: '100%' }}>
            {!selectedGroup && <Skeleton active paragraph={{ rows: 6 }} />}

            <Modal
                visible={!selectedGroup}
                title="Выберите группу"
                centered
                closable={false}
                footer={null}
                maskStyle={{ backdropFilter: 'blur(2px)' }}
            >
                <Input
                    placeholder="Поиск групп"
                    value={groupSearch}
                    onChange={e => setGroupSearch(e.target.value)}
                    suffix={<Popover content={filterContent} title="Фильтр групп"><FilterOutlined /></Popover>}
                />
                <List
                    style={{ marginTop: 12, maxHeight: 300, overflowY: 'auto' }}
                    bordered
                    dataSource={filteredGroups}
                    renderItem={g => {
                        const name = `${g.specNameShort} ${g.groupNumber} (${g.enterYear})`;
                        return (
                            <List.Item
                                onClick={() => setTempSelectedGroup(g)}
                                style={{ cursor: 'pointer', backgroundColor: tempSelectedGroup?.id === g.id ? '#e6f7ff' : undefined }}
                            >
                                <Space><UserOutlined />{name}</Space>
                            </List.Item>
                        );
                    }}
                />
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        disabled={!tempSelectedGroup}
                        onClick={() => setSelectedGroup(tempSelectedGroup)}
                    >OK</Button>
                </div>
            </Modal>

            {selectedGroup && (
                <div style={{ width:"100%" }}>
                    <div style={{ width:"100%", display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <Title level={2}><HddOutlined />Schedule for {selectedGroup.specNameShort} {selectedGroup.groupNumber}</Title>
                        <Button icon={<EditOutlined />} onClick={() => { setSelectedGroup(null); setTempSelectedGroup(null); }}>Change group</Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        loading={loadingSchedule}
                        pagination={false}
                        bordered
                        scroll={{ x: 'max-content' }}
                    />

                    <Drawer
                        title={<><EditOutlined /> {selectedLesson ? 'Edid schedule item' : 'Add schedule item'}</>}
                        width={400}
                        visible={lessonDrawerVisible}
                        onClose={() => setLessonDrawerVisible(false)}
                        footer={<Button type="primary" onClick={() => form.submit()}><CheckCircleOutlined /> {selectedLesson ? 'Update' : 'Add'}</Button>}
                    >
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                            <Form form={form} layout="vertical" onFinish={onLessonFinish} initialValues={{ practice: false, shared: false }}>
                                <Form.Item name="id" hidden><Input /></Form.Item>

                                <Form.Item label="Education Course" name="eduItem" rules={[{ required: true }]}>
                                    <Input
                                        readOnly
                                        placeholder="Select Course"
                                        onClick={() => setCourseDrawerVisible(true)}
                                        suffix={<SearchOutlined style={{ cursor: 'pointer' }} />}
                                    />
                                </Form.Item>

                                <Form.Item label="Teacher" name="teacher">
                                    <Input prefix={<UserOutlined />} placeholder="Input Teacher Name" />
                                </Form.Item>

                                <Form.Item label="Link to conference" name="conferenceUrl">
                                    <Input prefix={<LinkOutlined />} placeholder="https://conference.com/j/123" />
                                </Form.Item>

                                <Form.Item name="practice" valuePropName="checked">
                                    <Checkbox><ExperimentOutlined /> Practic</Checkbox>
                                </Form.Item>

                                <Form.Item name="shared" valuePropName="checked">
                                    <Checkbox><CheckCircleOutlined /> Shared</Checkbox>
                                </Form.Item>

                                <Form.Item name="timeSlot" hidden>
                                    <Input />
                                </Form.Item>
                            </Form>
                        </motion.div>
                    </Drawer>

                    <Drawer
                        title={<><BookOutlined /> Choose course</>}
                        width={360}
                        visible={courseDrawerVisible}
                        onClose={() => setCourseDrawerVisible(false)}
                    >
                        <Input
                            placeholder="Search course"
                            value={courseSearch}
                            onChange={e => setCourseSearch(e.target.value)}
                            suffix={<SearchOutlined />}
                            style={{ marginBottom: 12 }}
                        />
                        <List
                            bordered
                            dataSource={filteredCourses}
                            renderItem={c => (
                                <List.Item
                                    onClick={() => { form.setFieldsValue({ eduItem: c.name}); setCourseDrawerVisible(false); }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <List.Item.Meta
                                        avatar={<BookOutlined />}
                                        title={c.name}
                                    />
                                </List.Item>
                            )}
                        />
                    </Drawer>
                </div>
            )}
        </div>
    );
};

export default LessonSchedule;
