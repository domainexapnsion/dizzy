import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import { 
  Task, Subject, Topic, Card, GymLog, GymGoal, SkillLog, 
  FoodLog, Expense, Budget, EarningExperiment, Capture, 
  Book, Thought, Project, ProjectItem, Conversation, Setting, Nudge 
} from './models'

const adapter = new SQLiteAdapter({
  schema,
  // (Optional) Database name
  // dbName: 'kennyos',
  // (recommended) For higher performance
  jsi: true,
  onSetUpError: error => {
    // Database failed to load -- handle the error!
    console.error('WatermelonDB setup error:', error)
  }
})

export const database = new Database({
  adapter,
  modelClasses: [
    Task, Subject, Topic, Card, GymLog, GymGoal, SkillLog, 
    FoodLog, Expense, Budget, EarningExperiment, Capture, 
    Book, Thought, Project, ProjectItem, Conversation, Setting, Nudge
  ],
})
