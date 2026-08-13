import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  const { data, getProfileField, language, t } = useApp();
  const experiences = data.experiences || [];

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-rose-500" />
            {t.experienceSection}
          </h2>
          <div className="h-1.5 w-24 bg-rose-500 mt-4 rounded-full"></div>
        </div>
      </div>

      <div className="relative border-l-4 border-black dark:border-zinc-700 ml-4 md:ml-6 space-y-12 pb-8">
        {experiences.map((exp, idx) => {
          const company = getProfileField(exp.company);
          const role = getProfileField(exp.role);
          const desc = getProfileField(exp.description);

          return (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Node */}
              <div className="absolute -left-[14px] top-1.5 w-6 h-6 rounded-full bg-rose-500 border-4 border-white dark:border-zinc-900 shadow-[0_0_0_2px_#000] dark:shadow-[0_0_0_2px_#3f3f46] z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>

              {/* Content Card */}
              <div className="bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#f43f5e] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_#000] dark:hover:shadow-[10px_10px_0px_0px_#f43f5e] transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-black dark:text-white group-hover:text-rose-500 transition-colors">
                      {role}
                    </h3>
                    <p className="text-base md:text-lg font-bold text-zinc-600 dark:text-zinc-400 mt-1 flex items-center gap-2">
                      <span className="text-rose-500">@</span> {company}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-[2px_2px_0px_0px_#000] self-start md:self-auto">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                </div>

                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium mb-6">
                  {desc}
                </p>

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-zinc-100 dark:border-zinc-700 border-dashed">
                    {exp.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className="text-xs font-bold px-3 py-1 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-500 rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#71717a] flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3 text-rose-500" />
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
