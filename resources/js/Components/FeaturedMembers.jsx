import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { TEAM_COLORS } from '@/data/products';

const API_URL = 'https://jkt-48-member-api-i7i7.vercel.app';

const proxyPhoto = (url) => {
    if (!url) return null;
    if (url.includes('ui-avatars.com')) return url;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=256&h=256&fit=cover&output=webp`;
};

const avatarFallback = (name, teamColor) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'M')}&background=${(teamColor?.bg || '#FF1100').replace('#', '')}&color=fff&bold=true&size=256`;

function findApiMember(apiMembers, dbName) {
    if (!dbName || !apiMembers?.length) return null;
    const lower = dbName.toLowerCase();
    return (
        apiMembers.find(m => (m.name || '').toLowerCase() === lower) ||
        apiMembers.find(m => (m.nickname || '').toLowerCase() === lower) ||
        apiMembers.find(m => (m.name || '').toLowerCase().startsWith(lower)) ||
        apiMembers.find(m => lower.split(' ').some(t => t.length > 2 && (m.name || '').toLowerCase().includes(t)))
    );
}

export default function FeaturedMembers({ trendingMembers = [] }) {
    const [apiDataMap, setApiDataMap] = useState({});

    useEffect(() => {
        if (!trendingMembers.length) return;
        fetch(`${API_URL}/api/members`)
            .then(r => r.json())
            .then(data => {
                const apiList = Array.isArray(data) ? data : (data.members || data.data || []);
                const map = {};
                trendingMembers.forEach(m => {
                    const match = findApiMember(apiList, m.name);
                    if (match) {
                        map[m.name] = {
                            photo: proxyPhoto(match.photo || match.image),
                            nickname: match.nickname
                        };
                    }
                });
                setApiDataMap(map);
            })
            .catch(() => {}); // graceful failure — avatarFallback used
    }, [trendingMembers.length]);

    // Don't render section at all if no trending members in DB
    if (!trendingMembers.length) return null;

    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center mb-10"
                >
                    <div className="bg-[#BAE6FD] px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform rotate-1 mb-2">
                        <h2 className="text-2xl sm:text-3xl font-black font-display text-surface-900 tracking-tight uppercase">
                            TRENDING MEMBERS 💖
                        </h2>
                    </div>
                    <p className="text-surface-900 bg-white px-3 py-1 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] text-sm sm:text-base font-bold uppercase transform -rotate-1">
                        MEMBER DENGAN LISTING PALING BANYAK MINGGU INI
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
                    {trendingMembers.map((member, index) => {
                        const teamColor = TEAM_COLORS[member.team] || TEAM_COLORS.PASSION;
                        const apiData = apiDataMap[member.name];
                        const displayName = apiData?.nickname || member.name;
                        const photo = apiData?.photo || avatarFallback(displayName, teamColor);
                        return (
                            <motion.div
                                key={member.code || member.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ y: -6, scale: 1.05, rotate: (Math.random() - 0.5) * 6 }}
                                onClick={() => router.visit(route('members.show', member.code))}
                                className="group text-center cursor-pointer bg-white border-4 border-surface-900 p-4 shadow-[6px_6px_0_0_#0f172a] hover:shadow-[8px_8px_0_0_#0f172a] hover:bg-[#FEF08A] transition-all duration-200 flex flex-col items-center"
                            >
                                <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-4 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] overflow-hidden bg-surface-100 transform -rotate-2 group-hover:rotate-0 transition-transform">
                                    <img
                                        src={photo}
                                        alt={displayName}
                                        className="relative w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                                        onError={e => { e.target.src = avatarFallback(displayName, teamColor); }}
                                    />
                                    <div
                                        className="absolute -bottom-1 -right-1 px-2 py-1 border-t-4 border-l-4 border-surface-900 text-[10px] font-black uppercase tracking-widest text-surface-900 bg-white"
                                    >
                                        {member.listing_count} LISTING
                                    </div>
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-surface-900 mb-1">{displayName}</h3>
                                <p className="text-[10px] font-bold px-2 py-0.5 border-2 border-surface-900 bg-white shadow-[2px_2px_0_0_#0f172a] uppercase" style={{ color: teamColor.bg }}>{member.team}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
