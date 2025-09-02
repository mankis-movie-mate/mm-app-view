import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Feature from "@/components/Feature";
import Stat from "@/components/Stat";
import Link from "next/link";


export default function Home() {
    return (
        <main className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
            {/* Decorative glow blobs */}
            <div aria-hidden className="pointer-events-none absolute -top-40 right-[-20%] h-[480px] w-[480px] rounded-full bg-indigo-600/30 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-fuchsia-600/25 blur-3xl" />


            <Header />


            <section className="relative mx-auto max-w-6xl px-6 pb-8 pt-2 sm:pb-16">
                <div className="max-w-3xl">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        Discover movies you’ll
                        <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
{" "}actually love
</span>
                        .
                    </h1>
                    <p className="mt-4 text-lg text-white/70">
                        Kill the endless scroll. MovieMate learns your taste and serves
                        spot-on picks and curated lists.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/register"
                            className="rounded-lg px-5 py-3 bg-indigo-500 hover:bg-indigo-400 font-medium shadow-lg shadow-indigo-500/30 transition"
                        >
                            Get started
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-lg px-5 py-3 bg-white/10 hover:bg-white/20 ring-1 ring-white/10 transition"
                        >
                            I already have an account
                        </Link>
                    </div>
                </div>


                <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Feature
                        emoji="⭐"
                        title="Personalized Picks"
                        text="Recommendations tuned to your history, mood, and pace."
                    />


                    <Feature
                        emoji="📊"
                        title="Watchlists & Stats"
                        text="Track what you’ve watched and what’s next — beautifully."
                    />


                    <Feature
                        emoji="🤝"
                        title="Community Reviews"
                        text="See what your friends and the world think about a movie."
                    />
                </div>


                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Stat k="<1s" v="Avg. response" />
                    <Stat k="Zero" v="Ad noise" />
                    <Stat k="∞" v="Fun to explore" />
                </div>
            </section>


            <Footer />
        </main>
    );
}