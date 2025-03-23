import "./adminGroups.scss";
import { useEffect, useState } from "react";
import { useHttp } from "../../../hooks/http.hook";
import { Oval } from "react-loader-spinner";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import AdminGroupItem from "./adminGroupItem";

/* ======================================================
   CreateGroupModal Component (Modal for Creating Groups)
   ====================================================== */

// New schema for modal group creation. Note that we now use fields
// that match your JSON sample: enterYear, specNameShort, groupNumber, students.
const modalSchema = yup.object().shape({
    enterYear: yup
        .number()
        .required("Enter Year is required")
        .positive("Must be positive")
        .integer("Must be an integer")
        .min(2000, "Year must be at least 2000"),
    specNameShort: yup.string().required("Specialization Short Name is required"),
    groupNumber: yup
        .number()
        .required("Group Number is required")
        .positive("Must be positive")
        .integer("Must be an integer"),
    students: yup
        .array()
        .of(yup.object().required())
        .min(1, "Select at least one student")
});

const CreateGroupModal = ({ isOpen, onClose, onSubmit, users }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(modalSchema)
    });

    // Build searchable options from users.
    const userOptions = users.map(user => ({
        value: user.id, // adjust if your user object uses a different identifier
        label: `${user.firstName} ${user.lastName}`
    }));

    const submitHandler = data => {
        // Transform the form data into the desired payload.
        const payload = {
            enterYear: data.enterYear,
            specNameShort: data.specNameShort,
            groupNumber: data.groupNumber,
            students: data.students.map(student => student.value),
            subGroups: [],
            active: true
        };
        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Create Group</h2>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="form-group">
                        <label>Enter Year</label>
                        <input type="number" placeholder="2025" {...register("enterYear")} />
                        {errors.enterYear && (
                            <span className="error">{errors.enterYear.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Specialization Short Name</label>
                        <input type="text" placeholder="ІПЗ" {...register("specNameShort")} />
                        {errors.specNameShort && (
                            <span className="error">{errors.specNameShort.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Group Number</label>
                        <input type="number" placeholder="10" {...register("groupNumber")} />
                        {errors.groupNumber && (
                            <span className="error">{errors.groupNumber.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Students</label>
                        <Controller
                            name="students"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isMulti
                                    isSearchable
                                    placeholder="Select students..."
                                    options={userOptions}
                                    onChange={selected => field.onChange(selected)}
                                />
                            )}
                        />
                        {errors.students && (
                            <span className="error">{errors.students.message}</span>
                        )}
                    </div>
                    <button type="submit">Create Group</button>
                </form>
            </div>
        </div>
    );
};

/* ======================================================
   AdminGroups Component (Display groups list and modal)
   ====================================================== */

const AdminGroups = () => {
    const { GET, POST } = useHttp();

    // Local state for groups and users
    const [Groups, setGroups] = useState([]);
    const [users, setUsers] = useState([
        {
            id: "3b6df8d7-7add-4eae-9e18-4a2803c4fc13",
            firstName: "User",
            lastName: "One"
        }
        // Add more default users or fetch them from your API
    ]);
    const [Loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);

    // Fetch groups and then users data on mount.
    useEffect(() => {
        GET(null, "groupresource/groups/all", {
            Authorization: localStorage.getItem("jwt")
        }).then(res => {
            setGroups(res.data);
            setLoading(false);
            GET(null, "userdataresource/users", {
                Authorization: localStorage.getItem("jwt")
            }).then(result => {
                setUsers(result.data);
            });
        });
    }, []);

    // Render each group using your AdminGroupItem component.
    const renderItems = arr => {
        return arr.map(item => (
            <AdminGroupItem
                key={item.id}
                item={item}
                Groups={Groups}
                setGroups={setGroups}
            />
        ));
    };

    // Callback for modal submission. Sends POST request and updates groups list.
    const handleModalSubmit = payload => {
        POST(
            {},
            "groupresource/groups",
            { Authorization: localStorage.getItem("jwt") },
            payload
        ).then(res => {
            setGroups([...Groups, res.data]);
        });
        setModalOpen(false);
    };

    // Handler for link click to open modal.
    const handleOpenModal = (e) => {
        e.preventDefault();
        setModalOpen(true);
    };

    return (
        <>
            {Loading ? (
                <div className="oval__loader">
                    <Oval
                        visible={true}
                        height="120"
                        width="120"
                        color="#D90429"
                        secondaryColor="#2B2D42"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
            ) : (
                <div className="Admin__groups">
                    <div className="Admin__groups__table">
                        <h2>GroupsList</h2>
                        <div className="table-wrapper">
                            <table className="fl-table">
                                <thead>
                                <tr>
                                    <th>id</th>
                                    <th>enterYear</th>
                                    <th>endYear</th>
                                    <th>Name</th>
                                    <th>studentsId's</th>
                                    <th>Remove</th>
                                </tr>
                                </thead>
                                <tbody>{renderItems(Groups)}</tbody>
                            </table>
                        </div>
                    </div>
                    {/* Link that opens the modal */}
                    <div className="Admin__groups__form">
                        <a
                            href="#"
                            className="learning-groups__btn learning-groups__btn--primary"
                            onClick={handleOpenModal}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-plus learning-groups__icon"
                            >
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                            </svg>
                            <span>Create Group</span>
                        </a>
                    </div>
                </div>
            )}
            {/* Render the modal and pass users and submission callback */}
            <CreateGroupModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
                users={users}
            />
        </>
    );
};

export default AdminGroups;
