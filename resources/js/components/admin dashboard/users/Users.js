import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

// Components
import ReportUsersTable from "./ReportUsersTable";


export default function Users({ user }) {

    // Array of Users
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch users from api
    const fetchUsers = async () => {
        try {
            let response = await axios.get("/api/get-all-users");
            setUsers(response.data.users);
        } catch (error) {
            console.log(error.response);
        }
    };

    // Render
    return (
        <>
            <Container fluid className="p-4">
                <div className="mb-4">
                    <ReportUsersTable users={users} />
                </div>
            </Container>
        </>
    );
}
