import AppLayout from '@/Layouts/AppLayout';
import StudentForm from '@/Components/StudentForm';

export default function Edit({ student }) {
	return (
		<AppLayout>
			<h1 className="mb-6 text-2xl font-bold">Edit Siswa</h1>
			<StudentForm
				student={student}
				action={`/students/${student.id}`}
				method="put"
				submitLabel="Perbarui"
			/>
		</AppLayout>
	);
}
