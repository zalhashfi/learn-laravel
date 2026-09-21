import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui';

export default function Index({ students, q }) {
	const [search, setSearch] = useState(q ?? '');

	// Search: kirim query string lewat Inertia (tanpa reload halaman penuh)
	function submit(e) {
		e.preventDefault();
		router.get('/students', { q: search }, { preserveState: true });
	}

	function destroy(student) {
		if (confirm(`Yakin hapus ${student.name}?`)) {
			router.delete(`/students/${student.id}`);
		}
	}

	return (
		<AppLayout>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Daftar Siswa</h1>
				<Link
					href="/students/create"
					className="rounded-md bg-[#d1210f] px-3 py-2 text-sm font-medium text-white hover:bg-[#b01c0d]"
				>
					+ Tambah Siswa
				</Link>
			</div>

			<form onSubmit={submit} className="mb-6 flex gap-2">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Cari nama siswa..."
					className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d1210f]/40"
				/>
				<Button type="submit">Cari</Button>
				{q && (
					<Link href="/students" className="rounded-md bg-slate-200 px-3 py-2 text-sm text-slate-700">
						Reset
					</Link>
				)}
			</form>

			{/* Tabel kosong ditangani langsung di JSX (dulu @forelse/@empty di Blade) */}
			{students.data.length === 0 ? (
				<div className="rounded-md border border-dashed border-slate-300 px-4 py-8 text-center text-slate-500">
					Belum ada data siswa.{' '}
					<Link href="/students/create" className="text-[#d1210f] underline">
						Tambah sekarang
					</Link>
					.
				</div>
			) : (
				<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
					<table className="w-full text-left text-sm">
						<thead className="bg-slate-100 text-slate-600">
							<tr>
								<th className="px-4 py-2">#</th>
								<th className="px-4 py-2">Nama</th>
								<th className="px-4 py-2">Email</th>
								<th className="px-4 py-2">Jurusan</th>
								<th className="px-4 py-2 text-right">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{students.data.map((student, i) => (
								<tr key={student.id} className="border-t border-slate-100">
									<td className="px-4 py-2">{i + 1}</td>
									<td className="px-4 py-2">{student.name}</td>
									<td className="px-4 py-2">{student.email}</td>
									<td className="px-4 py-2">{student.major}</td>
									<td className="px-4 py-2">
										<div className="flex justify-end gap-2">
											<Link
												href={`/students/${student.id}`}
												className="rounded-md bg-slate-200 px-2 py-1 text-xs text-slate-700"
											>
												Detail
											</Link>
											<Link
												href={`/students/${student.id}/edit`}
												className="rounded-md bg-slate-200 px-2 py-1 text-xs text-slate-700"
											>
												Edit
											</Link>
											<Button variant="danger" className="px-2 py-1 text-xs" onClick={() => destroy(student)}>
												Hapus
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination: link halaman dari Laravel paginate() */}
			{students.last_page > 1 && (
				<div className="mt-6 flex gap-1">
					{students.links.map((link, i) =>
						link.url ? (
							<Link
								key={i}
								href={link.url}
								className={`rounded-md px-3 py-1 text-sm ${
									link.active ? 'bg-[#d1210f] text-white' : 'bg-slate-200 text-slate-700'
								}`}
								dangerouslySetInnerHTML={{ __html: link.label }}
							/>
						) : (
							<span
								key={i}
								className="rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-400"
								dangerouslySetInnerHTML={{ __html: link.label }}
							/>
						),
					)}
				</div>
			)}
		</AppLayout>
	);
}
