import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { Experience } from '../../types';
import { parseDescriptionSegments, sortExperiences } from '../../utils/textUtils';

export const ExperienceTimeline: React.FC = () => {
  const { data, getProfileField, language, t } = useApp();
  const experiences = sortExperiences<Experience>(data.experiences || []);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-2.5 sm:gap-3">
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-rose-500 shrink-0" />
            <span>{t.experienceSection}</span>
          </h2>
          <div className="h-1.5 w-16 sm:w-24 bg-rose-500 mt-2 sm:mt-4 rounded-full"></div>
        </div>
      </div>

      <div className="relative border-l-3 sm:border-l-4 border-black dark:border-zinc-700 ml-3 sm:ml-4 md:ml-6 space-y-8 sm:space-y-12 pb-6 sm:pb-8">
        {experiences.map((exp, idx) => {
          const company = getProfileField(exp.company);
          const role = getProfileField(exp.role);
          const desc = getProfileField(exp.description);
          const segments = parseDescriptionSegments(desc);

          return (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              className="relative pl-6 sm:pl-8 md:pl-12"
            >
              {/* Timeline Node */}
              <div className="absolute -left-[13px] sm:-left-[14px] top-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500 border-3 sm:border-4 border-white dark:border-zinc-900 shadow-[0_0_0_2px_#000] dark:shadow-[0_0_0_2px_#3f3f46] z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
              </div>

              {/* Content Card */}
              <div className="bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#f43f5e] sm:dark:shadow-[6px_6px_0px_0px_#f43f5e] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#000] dark:hover:shadow-[8px_8px_0px_0px_#f43f5e] transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-black dark:text-white group-hover:text-rose-500 transition-colors">
                      {role}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-zinc-600 dark:text-zinc-400 mt-0.5 sm:mt-1 flex items-center gap-1.5 sm:gap-2">
                      <span className="text-rose-500">@</span> {company}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-600 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_#000] self-start md:self-auto">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 shrink-0" />
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                </div>

                {segments.length > 0 && (
                  <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-6">
                    {segments.map((segment, sIdx) => {
                      const cleanSegment = segment.replace(/^[•\-\*\>]\s*/, '');
                      return (
                        <div 
                          key={sIdx} 
                          className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium"
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 mt-2 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
                          <span className="flex-1 break-words">{cleanSegment}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t-2 border-zinc-100 dark:border-zinc-700 border-dashed">
                    {exp.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className="text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-500 rounded-md shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#71717a] sm:dark:shadow-[2px_2px_0px_0px_#71717a] flex items-center gap-1"
                      >
                        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-500 shrink-0" />
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
