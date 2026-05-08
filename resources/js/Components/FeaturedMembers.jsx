import { motion } from 'framer-motion';
import { TRENDING_MEMBERS, TEAM_COLORS } from '@/data/products';

export default function FeaturedMembers() {
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
                    <p className="text-surface-500 text-sm sm:text-base">Member dengan listing paling dicari minggu ini</p>
                </motion.div>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {TRENDING_MEMBERS.map((member, index) => {
                        const teamColor = TEAM_COLORS[member.team] || TEAM_COLORS.PASSION;
                        return (
                            <motion.div
                                key={member.code}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ y: -6, scale: 1.03 }}
                                className="group text-center cursor-pointer"
                            >
                                <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-3">
                                    {/* Glow ring */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ boxShadow: `0 0 25px ${teamColor.bg}40, 0 0 50px ${teamColor.bg}20` }}
                                    />
                                    <div
                                        className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                                        style={{ background: `linear-gradient(135deg, ${teamColor.bg}, transparent)` }}
                                    />
                                    <img
                                        src={member.photo}
                                        alt={member.name}
                                        className="relative w-full h-full rounded-full object-cover object-top border-3 border-white shadow-md"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=${teamColor.bg.replace('#','')}&color=fff&size=96`;
                                        }}
                                    />
                                    {/* Listing count badge */}
                                    <div
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                                        style={{ backgroundColor: teamColor.bg }}
                                    >
                                        {member.listingCount} listing
                                    </div>
                                </div>
                                <h3 className="text-sm font-semibold text-surface-800 group-hover:text-primary-600 transition-colors">
                                    {member.name}
                                </h3>
                                <p className="text-[11px] font-medium mt-0.5" style={{ color: teamColor.bg }}>
                                    {member.team}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
