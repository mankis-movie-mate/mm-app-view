export default function Feature({
                                    emoji,
                                    title,
                                    text,
                                }: {
    emoji: string;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
            <div className="text-2xl">{emoji}</div>
            <h3 className="mt-3 text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-white/70">{text}</p>
        </div>
    );
}
