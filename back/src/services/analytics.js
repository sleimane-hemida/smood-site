import { query } from './database.js'

function formatMonthLabel(monthDate) {
  return new Intl.DateTimeFormat('fr-FR', { month: 'short' })
    .format(monthDate)
    .replace('.', '')
}

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours} h ${minutes.toString().padStart(2, '0')}`
  }

  return `${minutes} min`
}

function formatGrowth(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue > 0 ? '+100%' : '0%'
  }

  const delta = ((currentValue - previousValue) / previousValue) * 100
  const prefix = delta >= 0 ? '+' : ''
  return `${prefix}${delta.toFixed(1)}%`
}

export async function trackVisit(input) {
  const sessionId = input.sessionId?.trim()
  const pagePath = input.pagePath?.trim()
  const referrer = input.referrer?.trim() || null
  const userAgent = input.userAgent?.trim() || null

  if (!sessionId || !pagePath) {
    throw new Error('sessionId et pagePath sont obligatoires.')
  }

  const result = await query(
    `INSERT INTO visits (session_id, page_path, referrer, user_agent)
     VALUES ($1, $2, $3, $4)
     RETURNING id, session_id, page_path, referrer, user_agent, visited_at`,
    [sessionId, pagePath, referrer, userAgent],
  )

  return result.rows[0]
}

export async function getDashboardAnalytics() {
  const currentMonthResult = await query(
    `WITH current_month_visits AS (
       SELECT *
       FROM visits
       WHERE visited_at >= date_trunc('month', now())
         AND page_path <> '/admin'
     ),
     previous_month_visits AS (
       SELECT *
       FROM visits
       WHERE visited_at >= date_trunc('month', now()) - INTERVAL '1 month'
         AND visited_at < date_trunc('month', now())
         AND page_path <> '/admin'
     ),
     current_month_sessions AS (
       SELECT session_id,
              GREATEST(EXTRACT(EPOCH FROM MAX(visited_at) - MIN(visited_at)), 30) AS duration_seconds
       FROM current_month_visits
       GROUP BY session_id
     ),
     previous_month_sessions AS (
       SELECT session_id,
              GREATEST(EXTRACT(EPOCH FROM MAX(visited_at) - MIN(visited_at)), 30) AS duration_seconds
       FROM previous_month_visits
       GROUP BY session_id
     )
     SELECT
       (SELECT COUNT(DISTINCT session_id)::int FROM current_month_visits) AS visitors_count,
       (SELECT COUNT(*)::int FROM current_month_visits) AS page_views_count,
       (SELECT COALESCE(SUM(duration_seconds), 0)::int FROM current_month_sessions) AS duration_seconds,
       (SELECT COUNT(DISTINCT session_id)::int FROM previous_month_visits) AS previous_visitors_count,
       (SELECT COUNT(*)::int FROM previous_month_visits) AS previous_page_views_count,
       (SELECT COALESCE(SUM(duration_seconds), 0)::int FROM previous_month_sessions) AS previous_duration_seconds`,
  )

  const currentMonth = currentMonthResult.rows[0]

  const monthlyTrendResult = await query(
    `WITH months AS (
       SELECT generate_series(
         date_trunc('month', now()) - INTERVAL '7 months',
         date_trunc('month', now()),
         INTERVAL '1 month'
       ) AS month_start
     ),
     monthly_visitors AS (
       SELECT date_trunc('month', visited_at) AS month_start,
              COUNT(DISTINCT session_id)::int AS visitors
       FROM visits
       WHERE page_path <> '/admin'
       GROUP BY date_trunc('month', visited_at)
     )
     SELECT months.month_start, COALESCE(monthly_visitors.visitors, 0) AS visitors
     FROM months
     LEFT JOIN monthly_visitors ON monthly_visitors.month_start = months.month_start
     ORDER BY months.month_start`,
  )

  const visitorsCount = Number(currentMonth.visitors_count || 0)
  const pageViewsCount = Number(currentMonth.page_views_count || 0)
  const durationSeconds = Number(currentMonth.duration_seconds || 0)
  const previousVisitorsCount = Number(currentMonth.previous_visitors_count || 0)
  const previousPageViewsCount = Number(currentMonth.previous_page_views_count || 0)
  const previousDurationSeconds = Number(currentMonth.previous_duration_seconds || 0)

  return {
    metrics: [
      {
        label: 'Visiteurs ce mois-ci',
        value: visitorsCount.toLocaleString('fr-FR'),
        change: formatGrowth(visitorsCount, previousVisitorsCount),
      },
      {
        label: 'Temps cumule passe sur le site',
        value: formatDuration(durationSeconds),
        change: formatGrowth(durationSeconds, previousDurationSeconds),
      },
      {
        label: 'Pages visitees',
        value: pageViewsCount.toLocaleString('fr-FR'),
        change: formatGrowth(pageViewsCount, previousPageViewsCount),
      },
    ],
    visitorsTrend: monthlyTrendResult.rows.map((row) => ({
      month: formatMonthLabel(new Date(row.month_start)),
      visitors: Number(row.visitors),
    })),
  }
}