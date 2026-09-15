import useAdminDoctors from '../hooks/useAdminDoctors';
import AdminDoctorsView from '../views/AdminDoctorsView';

function AdminDoctorsPage() {
  const adminDoctors = useAdminDoctors();
  return <AdminDoctorsView {...adminDoctors} />;
}

export default AdminDoctorsPage;
