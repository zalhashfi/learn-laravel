import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
	const { flash } = usePage().props;

	return (
		<div className="min-h-screen bg-slate-50 text-slate-800">
			<header className="bg-slate-800 text-white">
				<div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
					<strong>Student Management System</strong>
					<span className="text-sm text-slate-400">Laravel + React · materi Backend</span>
				</div>
			</header>

			<main className="mx-auto max-w-4xl px-6 py-8">
				{/* Flash message: padanan session('success') di controller */}
				{flash?.success && (
					<div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800">
						{flash.success}
					</div>
				)}

				{children}
			</main>
		</div>
	);
}
