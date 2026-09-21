import AppLayout from '@/Layouts/AppLayout';
import StudentForm from '@/Components/StudentForm';

export default function Create() {
	return (
		<AppLayout>
			<h1 className="mb-6 text-2xl font-bold">Tambah Siswa</h1>
			<StudentForm action="/students" method="post" submitLabel="Simpan" />
		</AppLayout>
	);
}
