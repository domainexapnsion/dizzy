import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'priority', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'source', type: 'string' },
        { name: 'due_date', type: 'number', isOptional: true },
        { name: 'completed_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'subjects',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'exam_date', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'topics',
      columns: [
        { name: 'subject_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'last_revised_at', type: 'number', isOptional: true },
        { name: 'next_revision_at', type: 'number', isOptional: true },
        { name: 'fsrs_state', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'cards',
      columns: [
        { name: 'topic_id', type: 'string', isIndexed: true },
        { name: 'front', type: 'string' },
        { name: 'back', type: 'string' },
        { name: 'fsrs_state', type: 'string' },
        { name: 'due_date', type: 'number' },
        { name: 'last_reviewed', type: 'number', isOptional: true },
        { name: 'rating_history', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'gym_logs',
      columns: [
        { name: 'date', type: 'number' },
        { name: 'exercise', type: 'string' },
        { name: 'sets', type: 'number' },
        { name: 'reps', type: 'number' },
        { name: 'weight_kg', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'gym_goals',
      columns: [
        { name: 'exercise', type: 'string' },
        { name: 'target_weight', type: 'number' },
        { name: 'target_reps', type: 'number' },
        { name: 'target_sets', type: 'number' },
        { name: 'achieved', type: 'boolean' },
        { name: 'achieved_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'skill_logs',
      columns: [
        { name: 'skill_name', type: 'string' },
        { name: 'duration_mins', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'date', type: 'number' },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'food_logs',
      columns: [
        { name: 'date', type: 'number' },
        { name: 'meal_type', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'protein_est', type: 'string' },
        { name: 'skipped', type: 'boolean' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'expenses',
      columns: [
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'date', type: 'number' },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'budgets',
      columns: [
        { name: 'month', type: 'string' },
        { name: 'limit_amount', type: 'number' },
        { name: 'spent_amount', type: 'number' },
        { name: 'warned_70', type: 'boolean' },
        { name: 'warned_90', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'earning_experiments',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'status', type: 'string' },
        { name: 'amount_earned', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'captures',
      columns: [
        { name: 'type', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'summary', type: 'string', isOptional: true },
        { name: 'tags', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'source', type: 'string' },
        { name: 'read', type: 'boolean' },
        { name: 'saved_at', type: 'number' },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'books',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'author', type: 'string', isOptional: true },
        { name: 'total_pages', type: 'number', isOptional: true },
        { name: 'current_page', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'highlights', type: 'string' },
        { name: 'started_at', type: 'number', isOptional: true },
        { name: 'finished_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'thoughts',
      columns: [
        { name: 'raw_text', type: 'string' },
        { name: 'processed', type: 'boolean' },
        { name: 'tasks_extracted', type: 'string' },
        { name: 'ideas_extracted', type: 'string' },
        { name: 'worries', type: 'string' },
        { name: 'decisions', type: 'string' },
        { name: 'kenny_response', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'projects',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'status', type: 'string' },
        { name: 'tags', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'project_items',
      columns: [
        { name: 'project_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'title', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'conversations',
      columns: [
        { name: 'role', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'module_context', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'settings',
      columns: [
        { name: 'key', type: 'string', isIndexed: true },
        { name: 'value', type: 'string' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'nudges',
      columns: [
        { name: 'type', type: 'string' },
        { name: 'message', type: 'string' },
        { name: 'seen', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ]
    }),
  ]
})
