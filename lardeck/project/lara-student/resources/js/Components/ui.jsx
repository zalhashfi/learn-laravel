/**
 * Komponen kecil: menyembunyikan utility Tailwind yang panjang,
 * supaya halaman (Pages) tetap bersih dan mudah dibaca pemula.
 */

const buttonVariants = {
	primary: 'bg-[#d1210f] text-white hover:bg-[#b01c0d]',
	plain: 'bg-slate-200 text-slate-700 hover:bg-slate-300',
	danger: 'bg-red-700 text-white hover:bg-red-800',
};

export function Button({ variant = 'plain', className = '', ...props }) {
	return (
		<button
			{...props}
			className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
		/>
	);
}

export function Input({ label, error, id, ...props }) {
	return (
		<div className="mb-4">
			<label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
				{label}
			</label>
			<input
				{...props}
				id={id}
				className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d1210f]/40 ${
					error ? 'border-red-500' : 'border-slate-300'
				}`}
			/>
			{/* Pesan error per field: datang dari validasi Laravel lewat Inertia */}
			{error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
		</div>
	);
}
