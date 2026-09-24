import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Laptop, Sparkles, Check, Eye, Palette, Zap } from 'lucide-react'

export default function ThemeSelectorSection() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const themeOptions = [
    {
      id: 'light',
      title: 'Light Theme',
      subtitle: 'Crisp & Vibrant Daytime',
      description: 'Clean high-contrast daytime layout with pure white surfaces, crisp typography, and vivid colorful accents.',
      icon: Sun,
      iconColor: 'text-amber-500',
      activeGradient: 'from-amber-500 to-orange-500',
      badge: 'Daylight Mode',
      preview: {
        bg: 'bg-slate-50',
        card: 'bg-white border-slate-200 text-slate-900',
        pill: 'bg-blue-600 text-white',
        subtext: 'text-slate-500',
      },
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      subtitle: 'Obsidian & Neon Glow',
      description: 'Deep midnight OLED aesthetic engineered to minimize eye fatigue during evening shopping and maximize focus.',
      icon: Moon,
      iconColor: 'text-indigo-400',
      activeGradient: 'from-indigo-500 to-cyan-500',
      badge: 'Midnight OLED',
      preview: {
        bg: 'bg-slate-950',
        card: 'bg-slate-900 border-slate-800 text-slate-100',
        pill: 'bg-cyan-500 text-slate-950 font-bold',
        subtext: 'text-slate-400',
      },
    },
    {
      id: 'system',
      title: 'System Auto',
      subtitle: 'Device Synchronized',
      description: 'Automatically switches between Light and Dark mode based on your operating system and browser preferences.',
      icon: Laptop,
      iconColor: 'text-blue-500',
      activeGradient: 'from-blue-500 to-teal-500',
      badge: `Auto (${resolvedTheme === 'dark' ? 'Dark active' : 'Light active'})`,
      preview: {
        bg: resolvedTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-50',
        card: resolvedTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900',
        pill: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
        subtext: resolvedTheme === 'dark' ? 'text-slate-400' : 'text-slate-500',
      },
    },
  ]

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50/70 via-white to-gray-50/70 dark:from-gray-900/60 dark:via-gray-950 dark:to-gray-900/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
              <Palette className="w-3.5 h-3.5" />
              <span>Personalized Display Experience</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Choose Your Display Theme
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
              Customize OmniMarket's visual appearance to match your workspace lighting and comfort preferences.
            </p>
          </div>

          {/* Quick Segmented Control Switch */}
          <div className="flex items-center p-1.5 rounded-2xl bg-gray-200/80 dark:bg-gray-800 border border-gray-300/80 dark:border-gray-700 shadow-inner self-start md:self-auto">
            {themeOptions.map((opt) => {
              const Icon = opt.icon
              const isSelected = theme === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm scale-100'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? opt.iconColor : ''}`} />
                  <span>{opt.id.charAt(0).toUpperCase() + opt.id.slice(1)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3 Theme Mode Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themeOptions.map((opt) => {
            const Icon = opt.icon
            const isSelected = theme === opt.id

            return (
              <div
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer border flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-white dark:bg-gray-900/90 border-blue-500 dark:border-blue-500 shadow-xl ring-2 ring-blue-500/20 dark:ring-blue-400/20 scale-[1.02]'
                    : 'bg-white/80 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md'
                }`}
              >
                {/* Active Indicator Top Glow */}
                {isSelected && (
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${opt.activeGradient}`} />
                )}

                <div>
                  {/* Top Bar: Icon & Selection Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                    }`}>
                      <Icon className={`w-6 h-6 ${opt.iconColor}`} />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                      }`}>
                        {opt.badge}
                      </span>

                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'border-gray-300 dark:border-gray-700 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    {opt.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    {opt.subtitle}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {opt.description}
                  </p>
                </div>

                {/* Miniature Live Interface Preview */}
                <div className={`rounded-2xl p-4 border transition-all duration-200 ${opt.preview.bg} border-gray-200/60 dark:border-gray-800/80`}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Live UI Preview
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-mono">
                      {opt.id}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border shadow-xs transition-colors duration-200 ${opt.preview.card}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-2 w-16 bg-current opacity-30 rounded-full" />
                      <span className={`text-[9px] px-2 py-0.5 rounded-full ${opt.preview.pill}`}>
                        ₹2,499
                      </span>
                    </div>
                    <div className="h-2 w-28 bg-current opacity-20 rounded-full mb-1.5" />
                    <div className="h-1.5 w-20 bg-current opacity-15 rounded-full" />
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Bottom Feature Status Bar */}
        <div className="mt-8 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600 dark:text-gray-400 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Currently active: <strong className="text-gray-900 dark:text-white capitalize">{theme}</strong> ({resolvedTheme === 'dark' ? 'Dark Mode rendering' : 'Light Mode rendering'})
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant persistence in local storage
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Full ecosystem multi-store dark contrast
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
