import React, { useState, useEffect } from 'react';
import { useTask } from '../../useTask';
import { Shield, UserCheck, RefreshCw } from 'lucide-react';
import AdminPageHeader from '../shared/AdminPageHeader';
import ErrorMessage from '../shared/ErrorMessage';
import UsersTable from './UsersTable';

const AdminUsers = () => {
    const { executeTask, loading, error } = useTask();
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [updatingUser, setUpdatingUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const usersResult = await executeTask('user', 'api/users', {}, 'GET');
            if (usersResult && Array.isArray(usersResult)) {
                setUsers(usersResult);
            }
        } catch (err) {
            console.error('Error loading users:', err);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleRoleChange = async (username, newRole) => {
        if (!window.confirm(`Are you sure you want to change ${username}'s role to ${newRole}?`)) {
            return;
        }

        setUpdatingUser(username);
        try {
            const roleUpdate = { role: newRole };
            await executeTask('user', `api/users/${username}/role`, roleUpdate, 'PATCH');
            await loadUsers();
            alert('User role updated successfully!');
        } catch (err) {
            console.error('Error updating role:', err);
            alert('Failed to update user role: ' + (err.message || 'Unknown error'));
        } finally {
            setUpdatingUser(null);
        }
    };

    const adminUsers = users.filter(u => u.role === 'admin');
    const regularUsers = users.filter(u => u.role === 'regular_user');

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="User Management"
                description="Manage user roles and permissions"
            >
                <button
                    onClick={loadUsers}
                    disabled={isLoadingUsers}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </AdminPageHeader>

            <ErrorMessage error={error} />

            <UsersTable
                users={adminUsers}
                isLoading={isLoadingUsers}
                onRoleChange={handleRoleChange}
                updatingUser={updatingUser}
                loading={loading}
                role="admin"
                icon={Shield}
                iconColor="purple-600"
                title="Administrators"
            />

            <UsersTable
                users={regularUsers}
                isLoading={isLoadingUsers}
                onRoleChange={handleRoleChange}
                updatingUser={updatingUser}
                loading={loading}
                role="regular_user"
                icon={UserCheck}
                iconColor="blue-600"
                title="Regular Users"
            />
        </div>
    );
};

export default AdminUsers;

