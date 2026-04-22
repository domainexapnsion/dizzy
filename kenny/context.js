import { Q } from '@nozbe/watermelondb'
import { database } from '../db'

export const buildKennyContext = async () => {
  const now = new Date()
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime()
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime()

  // 1. Tasks
  const allTasks = await database.get('tasks').query().fetch()
  const overdue = allTasks.filter(t => t.due_date && t.due_date < startOfDay && t.status === 'pending')
  const dueToday = allTasks.filter(t => t.due_date >= startOfDay && t.due_date <= endOfDay && t.status === 'pending')

  // 2. Study
  const subjects = await database.get('subjects').query().fetch()
  const topics = await database.get('topics').query().fetch()
  
  const studyContext = subjects.map(s => {
    const subTopics = topics.filter(t => t.subject_id === s.id)
    const revisionDue = subTopics.filter(t => t.next_revision_at && t.next_revision_at <= endOfDay)
    return {
      name: s.name,
      exam_date: s.exam_date,
      topics_done: subTopics.filter(t => t.status === 'done').length,
      topics_total: subTopics.length,
      revision_due_today: revisionDue.map(t => t.name)
    }
  })

  // 3. Gym
  const lastGymLogs = await database.get('gym_logs').query(Q.sortBy('date', Q.desc), Q.take(5)).fetch()
  
  // 4. Finance
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  const budgets = await database.get('budgets').query(Q.where('month', currentMonth)).fetch()
  const budget = budgets[0] || { limit_amount: 0, spent_amount: 0 }

  // 5. Knowledge
  const unreadCapturesCount = await database.get('captures').query(Q.where('read', false)).fetchCount()

  // 6. Nudges
  const activeNudges = await database.get('nudges').query(Q.where('seen', false)).fetch()

  return {
    user: {
      name: "User",
      current_date: new Date().toLocaleDateString(),
      day_of_week: new Date().toLocaleDateString('en-US', { weekday: 'long' })
    },
    tasks: {
      overdue: overdue.map(t => t.title),
      due_today: dueToday.map(t => t.title)
    },
    study: studyContext,
    gym: {
      last_sessions: lastGymLogs.map(l => ({ exercise: l.exercise, date: l.date }))
    },
    finance: {
      month: currentMonth,
      limit: budget.limit_amount,
      spent: budget.spent_amount,
      percent_spent: budget.limit_amount > 0 ? (budget.spent_amount / budget.limit_amount) * 100 : 0
    },
    knowledge: {
      unread_captures: unreadCapturesCount
    },
    active_nudges: activeNudges.map(n => n.message)
  }
}
