import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, relation, children, lazy } from '@nozbe/watermelondb/decorators'

export class Task extends Model {
  static table = 'tasks'
  @text('title') title
  @text('description') description
  @text('priority') priority
  @text('status') status
  @text('source') source
  @field('due_date') due_date
  @field('completed_at') completed_at
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}

export class Subject extends Model {
  static table = 'subjects'
  static associations = {
    topics: { type: 'has_many', foreignKey: 'subject_id' }
  }
  @text('name') name
  @text('color') color
  @field('exam_date') exam_date
  @children('topics') topics
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}

export class Topic extends Model {
  static table = 'topics'
  static associations = {
    subjects: { type: 'belongs_to', key: 'subject_id' },
    cards: { type: 'has_many', foreignKey: 'topic_id' }
  }
  @relation('subjects', 'subject_id') subject
  @text('name') name
  @text('status') status
  @text('notes') notes
  @field('last_revised_at') last_revised_at
  @field('next_revision_at') next_revision_at
  @text('fsrs_state') fsrs_state
  @children('cards') cards
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}

export class Card extends Model {
  static table = 'cards'
  static associations = {
    topics: { type: 'belongs_to', key: 'topic_id' }
  }
  @relation('topics', 'topic_id') topic
  @text('front') front
  @text('back') back
  @text('fsrs_state') fsrs_state
  @field('due_date') due_date
  @field('last_reviewed') last_reviewed
  @text('rating_history') rating_history
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}

export class GymLog extends Model {
  static table = 'gym_logs'
  @field('date') date
  @text('exercise') exercise
  @field('sets') sets
  @field('reps') reps
  @field('weight_kg') weight_kg
  @text('notes') notes
  @readonly @date('created_at') createdAt
}

export class GymGoal extends Model {
  static table = 'gym_goals'
  @text('exercise') exercise
  @field('target_weight') target_weight
  @field('target_reps') target_reps
  @field('target_sets') target_sets
  @field('achieved') achieved
  @field('achieved_at') achieved_at
  @readonly @date('created_at') createdAt
}

export class SkillLog extends Model {
  static table = 'skill_logs'
  @text('skill_name') skill_name
  @field('duration_mins') duration_mins
  @text('notes') notes
  @field('date') date
  @readonly @date('created_at') createdAt
}

export class FoodLog extends Model {
  static table = 'food_logs'
  @field('date') date
  @text('meal_type') meal_type
  @text('description') description
  @text('protein_est') protein_est
  @field('skipped') skipped
  @text('notes') notes
  @readonly @date('created_at') createdAt
}

export class Expense extends Model {
  static table = 'expenses'
  @field('amount') amount
  @text('currency') currency
  @text('category') category
  @text('description') description
  @field('date') date
  @readonly @date('created_at') createdAt
}

export class Budget extends Model {
  static table = 'budgets'
  @text('month') month
  @field('limit_amount') limit_amount
  @field('spent_amount') spent_amount
  @field('warned_70') warned_70
  @field('warned_90') warned_90
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}

export class EarningExperiment extends Model {
  static table = 'earning_experiments'
  @text('title') title
  @text('description') description
  @text('status') status
  @field('amount_earned') amount_earned
  @text('notes') notes
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}

export class Capture extends Model {
  static table = 'captures'
  @text('type') type
  @text('content') content
  @text('summary') summary
  @text('tags') tags
  @text('category') category
  @text('source') source
  @field('read') read
  @field('saved_at') saved_at
  @readonly @date('created_at') createdAt
}

export class Book extends Model {
  static table = 'books'
  @text('title') title
  @text('author') author
  @field('total_pages') total_pages
  @field('current_page') current_page
  @text('status') status
  @text('highlights') highlights
  @field('started_at') started_at
  @field('finished_at') finished_at
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}

export class Thought extends Model {
  static table = 'thoughts'
  @text('raw_text') raw_text
  @field('processed') processed
  @text('tasks_extracted') tasks_extracted
  @text('ideas_extracted') ideas_extracted
  @text('worries') worries
  @text('decisions') decisions
  @text('kenny_response') kenny_response
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}

export class Project extends Model {
  static table = 'projects'
  static associations = {
    project_items: { type: 'has_many', foreignKey: 'project_id' }
  }
  @text('title') title
  @text('description') description
  @text('status') status
  @text('tags') tags
  @text('notes') notes
  @children('project_items') items
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
}

export class ProjectItem extends Model {
  static table = 'project_items'
  static associations = {
    projects: { type: 'belongs_to', key: 'project_id' }
  }
  @relation('projects', 'project_id') project
  @text('type') type
  @text('content') content
  @text('title') title
  @readonly @date('created_at') createdAt
}

export class Conversation extends Model {
  static table = 'conversations'
  @text('role') role
  @text('content') content
  @text('module_context') module_context
  @readonly @date('created_at') createdAt
}

export class Setting extends Model {
  static table = 'settings'
  @text('key') key
  @text('value') value
  @readonly @date('updated_at') updatedAt
}

export class Nudge extends Model {
  static table = 'nudges'
  @text('type') type
  @text('message') message
  @field('seen') seen
  @readonly @date('created_at') createdAt
}
