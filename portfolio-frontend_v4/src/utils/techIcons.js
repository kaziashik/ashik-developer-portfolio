import {
  SiAngular,
  SiAxios,
  SiBootstrap,
  SiCplusplus,
  SiCss,
  SiDaisyui,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFirebase,
  SiFlask,
  SiGit,
  SiGithub,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiOpenapiinitiative,
  SiOpenjdk,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVuedotjs,
  SiWebpack,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa6'

function normalizeSkillName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^\w\s.+#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const TECH_ICON_ENTRIES = [
  { keys: ['typescript', 'ts'], icon: SiTypescript, className: 'text-blue-500' },
  { keys: ['javascript', 'js'], icon: SiJavascript, className: 'text-yellow-500' },
  { keys: ['react'], icon: SiReact, className: 'text-cyan-400' },
  { keys: ['next.js', 'nextjs'], icon: SiNextdotjs, className: 'text-base-content' },
  { keys: ['vue', 'vue.js'], icon: SiVuedotjs, className: 'text-green-500' },
  { keys: ['angular'], icon: SiAngular, className: 'text-red-500' },
  { keys: ['redux'], icon: SiRedux, className: 'text-purple-500' },
  { keys: ['tailwind css', 'tailwind'], icon: SiTailwindcss, className: 'text-cyan-400' },
  { keys: ['daisyui'], icon: SiDaisyui, className: 'text-pink-500' },
  { keys: ['bootstrap'], icon: SiBootstrap, className: 'text-purple-600' },
  { keys: ['html5', 'html'], icon: SiHtml5, className: 'text-orange-500' },
  { keys: ['css3', 'css'], icon: SiCss, className: 'text-blue-500' },
  { keys: ['node.js', 'nodejs', 'node'], icon: SiNodedotjs, className: 'text-green-500' },
  { keys: ['express'], icon: SiExpress, className: 'text-base-content' },
  { keys: ['nestjs'], icon: SiNestjs, className: 'text-red-500' },
  { keys: ['fastapi'], icon: SiFastapi, className: 'text-teal-500' },
  { keys: ['flask'], icon: SiFlask, className: 'text-base-content' },
  { keys: ['graphql'], icon: SiGraphql, className: 'text-pink-500' },
  { keys: ['rest api', 'rest'], icon: SiOpenapiinitiative, className: 'text-green-600' },
  { keys: ['axios'], icon: SiAxios, className: 'text-purple-600' },
  { keys: ['prisma'], icon: SiPrisma, className: 'text-indigo-500' },
  { keys: ['postgresql', 'postgres'], icon: SiPostgresql, className: 'text-sky-500' },
  { keys: ['mongodb', 'mongo'], icon: SiMongodb, className: 'text-green-600' },
  { keys: ['mysql'], icon: SiMysql, className: 'text-sky-600' },
  { keys: ['redis'], icon: SiRedis, className: 'text-red-500' },
  { keys: ['supabase'], icon: SiSupabase, className: 'text-green-500' },
  { keys: ['firebase'], icon: SiFirebase, className: 'text-yellow-500' },
  { keys: ['docker'], icon: SiDocker, className: 'text-blue-500' },
  { keys: ['kubernetes', 'k8s'], icon: SiKubernetes, className: 'text-blue-600' },
  { keys: ['nginx'], icon: SiNginx, className: 'text-green-600' },
  { keys: ['vercel'], icon: SiVercel, className: 'text-base-content' },
  { keys: ['aws', 'amazon web services'], icon: FaAws, className: 'text-orange-500' },
  { keys: ['git'], icon: SiGit, className: 'text-orange-500' },
  { keys: ['github'], icon: SiGithub, className: 'text-base-content' },
  { keys: ['vite'], icon: SiVite, className: 'text-purple-500' },
  { keys: ['webpack'], icon: SiWebpack, className: 'text-blue-500' },
  { keys: ['python'], icon: SiPython, className: 'text-yellow-500' },
  { keys: ['java'], icon: SiOpenjdk, className: 'text-red-600' },
  { keys: ['c++', 'cpp'], icon: SiCplusplus, className: 'text-blue-600' },
  { keys: ['linux'], icon: SiLinux, className: 'text-base-content' },
]

function matchesKey(normalized, key) {
  return normalized === key || normalized.startsWith(`${key} `) || normalized.endsWith(` ${key}`)
}

export function getTechIcon(skillName) {
  const normalized = normalizeSkillName(skillName)
  if (!normalized) return null

  for (const entry of TECH_ICON_ENTRIES) {
    if (entry.keys.some((key) => matchesKey(normalized, key))) {
      return entry
    }
  }

  for (const entry of TECH_ICON_ENTRIES) {
    if (entry.keys.some((key) => normalized.includes(key))) {
      return entry
    }
  }

  return null
}

export function getTechIconList() {
  return TECH_ICON_ENTRIES.flatMap((entry) =>
    entry.keys.map((key) => ({
      name: key,
      icon: entry.icon,
      className: entry.className,
    }))
  )
}

export default getTechIcon
