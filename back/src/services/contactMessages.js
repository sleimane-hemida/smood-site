import { query } from './database.js'

export async function listContactMessages(limit = 50) {
  const result = await query(
    `SELECT id, name, email, phone, subject, message, created_at
     FROM contact_messages
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit],
  )

  return result.rows
}

export async function createContactMessage(input) {
  const name = input.name?.trim()
  const email = input.email?.trim()
  const phone = input.phone?.trim() || null
  const subject = input.subject?.trim()
  const message = input.message?.trim()

  if (!name || !email || !subject || !message) {
    throw new Error('Les champs nom, email, sujet et message sont obligatoires.')
  }

  const result = await query(
    `INSERT INTO contact_messages (name, email, phone, subject, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, subject, message, created_at`,
    [name, email, phone, subject, message],
  )

  return result.rows[0]
}