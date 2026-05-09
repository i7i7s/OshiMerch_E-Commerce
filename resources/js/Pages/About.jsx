import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// No external icon library used, pure SVG or typography instead!
const StarSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z" />
    </svg>
);

const ArrowSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const THE_REST = [
    {
        name: 'Aidil Addzikra',
        role: 'BACKEND ARCHITECT',
        desc: 'Membangun pondasi database dan API yang solid agar transaksi lancar tanpa hambatan.',
        color: 'bg-blue-600'
    },
    {
        name: 'Al Ilham Daffa Nurridho',
        role: 'FRONTEND SPECIALIST',
        desc: 'Menghidupkan desain menjadi interaksi yang mulus dan responsif di berbagai perangkat.',
        color: 'bg-emerald-500'
    },
    {
        name: 'Erizal Rahmad Pramudhita',
        role: 'PRODUCT STRATEGIST',
        desc: 'Menyelaraskan kebutuhan bisnis dan kepuasan fandom untuk fitur yang tepat sasaran.',
        color: 'bg-orange-500'
    }
];

export default function About({ auth }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    
    const yTransform = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <>
            <Head title="Tentang Kami — OshiMerch" />

            <div className="min-h-screen bg-surface-50 selection:bg-primary-200 selection:text-primary-900 overflow-hidden" ref={containerRef}>
                <Navbar auth={auth} />

                {/* --- HERO SECTION --- */}
                <div className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
                    <motion.div style={{ y: yTransform, opacity: opacityTransform }} className="text-center z-10 relative">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-surface-200 shadow-sm mb-8"
                        >
                            <StarSVG className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-bold uppercase tracking-widest text-surface-900">Di Balik Layar</span>
                            <StarSVG className="w-4 h-4 text-primary-500" />
                        </motion.div>

                        <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tighter text-surface-950 uppercase leading-[0.85]">
                            WE ARE<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-500">
                                OSHIMERCH
                            </span>
                        </h1>
                        
                        <p className="mt-8 text-lg sm:text-2xl text-surface-600 max-w-3xl mx-auto font-medium leading-relaxed">
                            Bukan sekadar *marketplace*. Kami adalah wadah tempat dedikasi fandom dan inovasi teknologi bersatu. Dibuat oleh fans, untuk fans.
                        </p>
                    </motion.div>

                    {/* Abstract typography background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-[0.03]">
                        <h2 className="text-[30vw] font-black leading-none whitespace-nowrap">OSHIMERCH</h2>
                    </div>
                </div>

                {/* --- MARQUEE TRANSITION --- */}
                <div className="w-full bg-surface-900 py-6 overflow-hidden transform -rotate-2 scale-105 relative z-20">
                    <motion.div 
                        animate={{ x: ["0%", "-50%"] }} 
                        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                        className="flex whitespace-nowrap gap-8"
                    >
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="flex items-center gap-8">
                                <span className="text-4xl font-display font-black text-white uppercase italic">Meet The Creators</span>
                                <StarSVG className="w-8 h-8 text-primary-500" />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* --- 2. THE MASTERMIND (DAFFA) - ASYMMETRIC HUGE LAYOUT --- */}
                <section className="border-y border-surface-200 bg-white relative z-10">
                    <div className="flex flex-col lg:flex-row min-h-screen">
                        
                        {/* Left: Huge Image */}
                        <div className="lg:w-1/2 relative border-b lg:border-b-0 lg:border-r border-surface-200 overflow-hidden bg-surface-100 group">
                            {/* We use a heavy brutalist hover effect */}
                            <img 
                                src="/images/team/daffa.png" 
                                alt="Muhammad Daffa Alwafi" 
                                className="w-full h-full object-cover object-center grayscale contrast-125 mix-blend-luminosity group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-700" 
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=Daffa+Alwafi&background=FF1100&color=fff&size=512` }}
                            />
                            
                            {/* Decorative badge */}
                            <div className="absolute top-16 sm:top-24 left-8 sm:left-12 bg-primary-600 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest rotate-[-5deg] shadow-xl z-20">
                                Founder
                            </div>
                        </div>

                        {/* Right: Typography Focus */}
                        <div className="lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 lg:p-24 relative overflow-hidden">
                            {/* Background giant watermark */}
                            <div className="absolute -right-20 top-1/4 text-[200px] font-black text-surface-50 opacity-50 select-none pointer-events-none rotate-90 origin-right">
                                01
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="relative z-10"
                            >
                                <p className="text-primary-600 font-bold tracking-widest uppercase mb-4 flex items-center gap-4">
                                    <span className="w-12 h-1 bg-primary-600"></span>
                                    The Mastermind
                                </p>
                                <h2 className="text-5xl sm:text-7xl font-display font-black text-surface-950 uppercase leading-none mb-6">
                                    Muhammad<br/>Daffa Alwafi
                                </h2>
                                <h3 className="text-2xl font-bold text-surface-400 mb-8">
                                    Lead Engineer & Visionary
                                </h3>
                                <p className="text-xl leading-relaxed text-surface-700 max-w-xl">
                                    Merancang arsitektur utama OshiMerch dan meramu pengalaman antarmuka yang tidak membosankan. Daffa memastikan setiap interaksi di platform ini terasa premium dan memanjakan mata para Wota.
                                </p>
                            </motion.div>
                        </div>

                    </div>
                </section>

                {/* --- 3. THE PILLARS (THE REST OF THE TEAM) - BRUTALIST LIST --- */}
                <section className="bg-surface-950 text-white py-24 sm:py-32 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-24">
                            <h2 className="text-5xl sm:text-7xl font-display font-black uppercase leading-none">
                                The<br/>Pillars
                            </h2>
                            <p className="text-surface-400 max-w-xs text-lg mt-6 md:mt-0">
                                Kekuatan inti di balik layar yang memastikan OshiMerch beroperasi dengan sempurna.
                            </p>
                        </div>

                        {/* List Layout */}
                        <div className="border-t-2 border-surface-800">
                            {THE_REST.map((member, i) => (
                                <motion.div 
                                    key={member.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative border-b-2 border-surface-800 py-8 sm:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-surface-900 transition-colors px-4 -mx-4 sm:px-8 sm:-mx-8 cursor-default overflow-hidden"
                                >
                                    {/* Abstract Color Blob that appears on hover */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${member.color} transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300`}></div>

                                    <div className="flex-1 z-10 relative">
                                        <p className="text-surface-500 font-mono text-sm mb-2 opacity-50">0{i+2}</p>
                                        <h3 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight group-hover:text-primary-400 transition-colors">
                                            {member.name}
                                        </h3>
                                    </div>
                                    
                                    <div className="lg:w-1/3 z-10 relative">
                                        <p className="text-primary-500 font-bold tracking-widest uppercase mb-2">
                                            {member.role}
                                        </p>
                                        <p className="text-surface-400 text-lg">
                                            {member.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
