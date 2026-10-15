import { useEffect, useState } from "react";
import { DataTable, Button } from "@/shared";
import { userColumns } from "../table/UserColumns";
import { getUsers } from "../services/userServices";
import { Link } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";

export default function UserListPage(){
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch((requestError) => setError(requestError.message));
    }, []);

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
                <DataTable data={users} columns={userColumns} />
            )}
            <ReportConfigModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
        </div>
    );
}