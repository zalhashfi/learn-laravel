import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ student }) {
	const rows = [
		['ID', student.id],
		['Nama', student.name],
		['Email', student.email],
		['Jurusan', student.major],
	];

	return (
		<AppLayout>
			<h1 className="mb-6 text-2xl font-bold">Detail Siswa</h1>

			<div className="rounded-md border border-slate-200 bg-white">
				<table className="w-full text-left text-sm">
					<tbody>
						{rows.map(([label, value]) => (
							<tr key={label} className="border-b border-slate-100 last:border-0">
								<th className="w-40 px-4 py-3 text-slate-500">{label}</th>
								<td className="px-4 py-3">{value}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-6 flex gap-2">
				<Link
					href={`/students/${student.id}/edit`}
					className="rounded-md bg-[#d1210f] px-4 py-2 text-sm font-medium text-white hover:bg-[#b01c0d]"
				>
					Edit
				</Link>
				<Link href="/students" className="rounded-md bg-slate-200 px-4 py-2 text-sm text-slate-700">
					Kembali
				</Link>
			</div>
		</AppLayout>
	);
}
