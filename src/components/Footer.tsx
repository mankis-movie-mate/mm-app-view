export default function Footer() {
    return (
        <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/60">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} MovieMate :) </p>
                <div className="flex gap-4" />
            </div>
        </footer>
    );
}
