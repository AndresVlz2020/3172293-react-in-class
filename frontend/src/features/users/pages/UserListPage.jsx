import { useEffect, useMemo, useState, useCallback } from "react";
import { DataTable, Button } from "@/shared";
import { getUserColumns } from "../table/UserColumns";
import { getUsers } from "../services/userServices";
import { Link } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";

export default function UserListPage() {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch((requestError) => setError(requestError.message));
    }, []);

    const handleStatusUpdated = useCallback((userId, newStatus) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, isActive: Boolean(newStatus) } : user,
            ),
        );
    }, []);

    const columns = useMemo(
        () => getUserColumns(handleStatusUpdated),
        [handleStatusUpdated],
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Listado de usuarios</h1>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setIsReportOpen(true)}>
                        Generar reporte
                    </Button>
                    <Link to="/dashboard">
                        <Button>Crear usuario</Button>
                    </Link>
                </div>
            </div>
            {error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <DataTable data={users} columns={columns} />
            )}
            <ReportConfigModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
        </div>
    );
}
