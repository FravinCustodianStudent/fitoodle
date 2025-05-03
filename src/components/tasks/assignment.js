import "./assignment.scss";
import resultSrc from "../../assets/result.svg";
import infoSrc from "../../assets/info.svg";
import uploadSrc from "../../assets/upload.svg";
import arrowSrc from "../../assets/arrow.svg";
import downoloadSrc from "../../assets/downoload.svg";
import {HandySvg} from "handy-svg";
import FileForCheck from "./fileForCheck/fileForCheck";
import FileInfo from "./fileInfo/fileInfo";
import {useHttp} from "../../hooks/http.hook";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Oval} from "react-loader-spinner";
import {Card, Upload, Button, Typography, message, Spin} from 'antd';
import { UploadOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Text } = Typography;
const Assignment = () =>{
    const {GET, FilePost, DELETE,PUT } = useHttp();
    const [Loading, setLoading] = useState(true)
    const user = useSelector(state => state.users.user);
    const {taskId} = useParams();
    const [Mark, setMark] = useState();
    const [TaskResult, setTaskResult] = useState();
    const [Task, setTask] = useState({});
    const [LoadingFiles, setLoadingFiles] = useState(true);
    const [TaskLoadingFiles, setTaskLoadingFiles] = useState(true);
    const [Files, setFiles] = useState();
    const [resultTaskFiles, setResultTaskFiles] = useState();
    useEffect(() => {
        //TODO fix user bad request - see console
        if (user.length!==0){
            console.log(user)
            GET({},`taskresource/tasks/${taskId}`,{})
                .then((res)=>{
                    setTask(res.data);
                    const route = user.id;
                    console.log(route);
                    GET({taskId:taskId,userId:route},`taskresource/taskResult/by/task/user`,{})
                        .then((result)=>{
                            setTaskResult(result.data)
                            GET({taskResultId:result.data.id},`taskresource/marks/by/testResult`,{})
                                .then((markRes)=>{
                                    setMark(markRes.data)
                                    setLoading(false);
                                })
                        })
                        .catch((err)=>{
                            console.log(err)
                        });
                })
        }

    }, [user]);
    useEffect(() => {
        if (Task.attachedFiles?.length) {
            const query = Task.attachedFiles.map(id => `files=${id}`).join('&');
            setLoadingFiles(true);
            GET({}, `fileresource/files/defined?${query}`, {})
                .then(res => setFiles(res.data))
                .catch(() => message.error('Failed to load file info'))
                .finally(() => setLoadingFiles(false));
        } else {
            setFiles([]);
            setLoadingFiles(false);
        }
    }, [Task]);
    useEffect(() => {
        if (TaskResult?.completed) {
            const query = TaskResult.attachedFiles.map(id => `files=${id}`).join('&');
            setTaskLoadingFiles(true);
            GET({}, `fileresource/files/defined?${query}`, {})
                .then(res => {
                    setResultTaskFiles(res.data)
                    setTaskLoadingFiles(false)
                })
                .catch(() => message.error('Failed to load file info'))
                .finally(() => setLoadingFiles(false));
        }
    },[TaskResult])
    const onSubmit = (idsOfFiles) => {
        const nowIsoLocal = new Date()
            .toISOString()        // "2025-05-02T22:51:07.829Z"
            .split('.')[0];       // "2025-05-02T22:51:07"

        const body = {
            id:           TaskResult.id,
            taskId:       TaskResult.taskId,
            studentId:    TaskResult.studentId,
            completed:    TaskResult.completed,      // keep false
            completionTime: nowIsoLocal, // may be null or existing
            attachedFiles: idsOfFiles
        };
        console.log(body)

             PUT(
                {}, `taskresource/taskResult`, {}, body
            ).then((res)=>{
                 message.success("Ваші файли успішно підтверджено");
                 setTaskResult(res.data);
                 }

             ).catch(err=>{
                 console.log(err)
                 console.error(err);
                 message.error("Не вдалося зберегти результат завдання");
             })


    };

    const ConvertDate = (date) =>{
        const [datePart, timePart] = date.split('T')
        const [year, month, day] = datePart.split('-').map(Number);
        const unformattedDate = new Date(year, month - 1, day);
        const readyDate = `${unformattedDate.getDay()<10?"0"+unformattedDate.getDay():unformattedDate.getDay()}.${
            unformattedDate.getMonth()+1<10?"0"+(unformattedDate.getMonth()+1):(unformattedDate.getMonth()+1)}.${
            unformattedDate.getFullYear()}`
        return readyDate;
    }
    const renderFileForUpload = arr =>{
        console.log(arr)
        const items = arr.map(item => {
            return <FileInfo file={item}/>;
        })
        return(
            items
        )
    }
    const [fileList, setFileList] = useState([]);

    // 3) configure Dragger
    const uploadProps = {
        multiple: false,
        fileList,
        beforeUpload: (file) => {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) message.error('Файл має бути меншим за 2MB!');
            return isLt2M;
        },
        customRequest: async ({ file, onProgress, onSuccess, onError }) => {
            // add to list in “uploading” state

            const formData = new FormData();
            formData.append('file', file);

            // fake progress emitter
            let pct = 0;
            const fakeInt = setInterval(() => {
                pct += 10;
                onProgress({ percent: pct });
                setFileList((prev) =>
                    prev.map((f) =>
                        f.uid === file.uid ? { ...f, percent: pct } : f
                    )
                );
                if (pct >= 90) clearInterval(fakeInt);
            }, 100);

            try {
                const res = await FilePost('fileresource/files', formData);
                clearInterval(fakeInt);

                setFileList((prev) =>
                    prev.map((f) =>
                        f.uid === file.uid
                            ? {
                                ...f,
                                status: 'done',
                                percent: 100,
                                response: res.data
                            }
                            : f
                    )
                );
                onSuccess(res.data, file);
                message.success(`${file.name} успішно завантажено`);
            } catch (err) {
                clearInterval(fakeInt);
                setFileList((prev) =>
                    prev.map((f) =>
                        f.uid === file.uid
                            ? { ...f, status: 'error', percent: 100 }
                            : f
                    )
                );
                onError(err);
                message.error(`Помилка завантаження ${file.name}`);
            }
        },
        onChange({ fileList: newList }) {
            setFileList(newList);
        },
        onRemove: async (file) => {
            try {
                await DELETE({}, `fileresource/files/${file.response.id}`, {});
                setFileList((prev) =>
                    prev.filter((f) => f.uid !== file.uid)
                );
                message.success(`${file.name} видалено`);
            } catch {
                message.error('Не вдалося видалити файл');
            }
        },
        showUploadList: {
            showRemoveIcon: true,
            showPreviewIcon: false,
            showDownloadIcon: false
        },
        onPreview: (file) => {
            const url = file.response?.driveUrl || URL.createObjectURL(file.originFileObj);
            window.open(url, '_blank');
        }
    };

    // 4) when user clicks “Підтвердити”
    const handleConfirm = () => {
        // pass back the list of uploaded file IDs
        const ids = fileList.map((f) => f.response?.id).filter(Boolean);
        onSubmit(ids);
    };
    return (
        <>
            {Loading ?<div className="oval__loader"><Oval
                visible={true}
                height="120"
                width="120"
                color="#D90429"
                secondaryColor="#2B2D42"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            /></div> : <div className="assignment">
                <div className="assignment__header">
                    <div className="assignment__header__name">
                        <div className="assignment__header__name__text">{Task.name}</div>
                        <div className="assignment__header__name__info">
                            <div className="assignment__header__name__info__type">Lab</div>
                            <div className="assignment__header__name__info__separator"></div>
                            <div className="assignment__header__name__info__date">{ConvertDate(Task.createdAt)}</div>
                        </div>
                    </div>
                    <div className="assignment__header__info">
                        <div className="assignment__header__info__details">
                            <div className="assignment__header__info__details__date">due date {ConvertDate(Task.deadline)}</div>
                            <div className="assignment__header__info__details__mark">
                                <div className="assignment__header__info__details__mark__name">Current result</div>
                                <div className="assignment__header__info__details__mark__content">{Mark.markValue}/{Task.maxMarkValue}</div>
                            </div>
                        </div>
                        <div className="assignment__header__info__icon">
                            <div className="assignment__header__info__icon__svg">
                                <HandySvg src={resultSrc}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="assignment__main">
                    <div className="assignment__main__description">
                        <div className="assignment__main__description__info">
                            <div className="assignment__main__description__info__header">
                                <div className="assignment__main__description__info__header__icon"><HandySvg src={infoSrc}/></div>
                                <div className="assignment__main__description__info__header__name">Загальна інформація</div>
                            </div>
                            <div className="assignment__main__description__info__content">
                                {Task.description}
                            </div>
                        </div>
                        <div className="assignment__main__description__task">
                            {LoadingFiles
                                ? <Spin  tip="Завантаження файлів..." />
                                : renderFileForUpload(Files)
                            }
                        </div>
                    </div>
                    {/*TODO make form real not mock*/}
                    <Card bordered={false} style={{ maxWidth: 500 }}>
                        {TaskResult?.completed ? (
                            <>
                                <div
                                    className="separator"
                                    style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}
                                >
                                    <UploadOutlined style={{ fontSize: 24, marginRight: 8 }} />
                                    <Text strong>Ви надіслали завдання</Text>
                                </div>
                                {Mark?.comment && (
                                    <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 4 }}>
                                        <Typography.Title level={5}>Коментар викладача</Typography.Title>
                                        <Typography.Text>{Mark.comment}</Typography.Text>
                                    </div>
                                )}
                                <Typography.Title level={5}>
                                    Ваші надіслані файли
                                </Typography.Title>
                                {TaskLoadingFiles
                                    ? <Spin tip="Завантаження файлів..." />
                                    : renderFileForUpload(resultTaskFiles)
                                }
                            </>
                        ) : (
                            <>
                                <div
                                    className="separator"
                                    style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}
                                >
                                    <UploadOutlined style={{ fontSize: 24, marginRight: 8 }} />
                                    <Text strong>Завдання</Text>
                                </div>

                                <Dragger {...uploadProps} style={{ padding: '24px 0' }}>
                                    <p className="ant-upload-drag-icon">
                                        <UploadOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                        Перетягніть файл сюди або натисніть для вибору
                                    </p>
                                    <p className="ant-upload-hint">
                                        Найбільший розмір файлу — 5 МБ
                                    </p>
                                </Dragger>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                                    <Button
                                        icon={<UploadOutlined />}
                                        onClick={() => document.querySelector('.ant-upload input').click()}
                                    >
                                        Завантажити файл
                                    </Button>

                                    <Button
                                        type="primary"
                                        icon={<ArrowRightOutlined />}
                                        disabled={!fileList.length}
                                        onClick={() => {
                                            const ids = fileList
                                                .map(f => f.response?.id)
                                                .filter(Boolean);
                                            onSubmit(ids);
                                        }}
                                    >
                                        Підтвердити
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            </div>}
        </>

    )
}
export default Assignment;