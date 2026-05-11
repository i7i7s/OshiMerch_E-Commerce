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
                    className="text-center mb-10"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 tracking-tight mb-2">
                        Trending Members 💖
                    </h2>
                    <p className="text-surface-500 text-sm sm:text-base">Member dengan listing paling banyak minggu ini</p>
                </motion.div>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
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
                                whileHover={{ y: -6, scale: 1.03 }}
                                onClick={() => router.visit(route('members.show', member.code))}
                                className="group text-center cursor-pointer"
                            >
                                <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-3">
                                    <motion.div
                                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ boxShadow: `0 0 25px ${teamColor.bg}40, 0 0 50px ${teamColor.bg}20` }}
                                    />
                                    <div
                                        className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                                        style={{ background: `linear-gradient(135deg, ${teamColor.bg}, transparent)` }}
                                    />
                                    <img
                                        src={photo}
                                        alt={displayName}
                                        className="relative w-full h-full rounded-full object-cover object-top border-2 border-white shadow-md"
                                        onError={e => { e.target.src = avatarFallback(displayName, teamColor); }}
                                    />
                                    <div
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm whitespace-nowrap"
                                        style={{ backgroundColor: teamColor.bg }}
                                    >
                                        {member.listing_count} listing
                                    </div>
                                </div>
                                <h3 className="text-sm font-semibold text-surface-800 group-hover:text-primary-600 transition-colors">{displayName}</h3>
                                <p className="text-[11px] font-medium mt-0.5" style={{ color: teamColor.bg }}>{member.team}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
