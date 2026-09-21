import { useForm } from '@inertiajs/react';
import { Input } from '@/Components/ui';

/**
 * Form bersama untuk Create & Edit.
 *
 * useForm() adalah pengganti old() dan @error di Blade:
 * Inertia menyimpan nilai input dan error validasi otomatis,
 * jadi user tidak perlu mengetik ulang saat validasi gagal.
 */
export default function StudentForm({ student, action, method, submitLabel }) {
	const { data, setData, post, put, processing, errors } = useForm({
		name: student?.name ?? '',
		email: student?.email ?? '',
		major: student?.major ?? '',
	});

	function submit(e) {
		e.preventDefault();
		if (method === 'post') {
			post(action);
		} else {
			put(action);
		}
	}

	return (
		<form onSubmit={submit} className="rounded-md border border-slate-200 bg-white p-6">
			<Input
				id="name"
				label="Nama"
				placeholder="Nama lengkap"
				value={data.name}
				onChange={(e) => setData('name', e.target.value)}
				error={errors.name}
			/>
			<Input
				id="email"
				label="Email"
				type="email"
				placeholder="nama@campus.ac.id"
				value={data.email}
				onChange={(e) => setData('email', e.target.value)}
				error={errors.email}
			/>
			<Input
				id="major"
				label="Jurusan"
				placeholder="Informatika"
				value={data.major}
				onChange={(e) => setData('major', e.target.value)}
				error={errors.major}
			/>

			<div className="flex gap-2">
				<button
					type="submit"
					disabled={processing}
					className="cursor-pointer rounded-md bg-[#d1210f] px-4 py-2 text-sm font-medium text-white hover:bg-[#b01c0d] disabled:opacity-50"
				>
					{submitLabel}
				</button>
				<a
					href="/students"
					className="rounded-md bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
				>
					Batal
				</a>
			</div>
		</form>
	);
}
