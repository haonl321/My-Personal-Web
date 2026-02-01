import { NextResponse } from 'next/server';
import pool from '@/lib/db/pg';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM failures WHERE user_id = $1 ORDER BY occurred_at DESC',
      [userId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, user_id, title, description, category_id, 
      mood, severity, lesson, action_plan, occurred_at 
    } = body;

    const result = await pool.query(
      `INSERT INTO failures (
        id, user_id, title, description, category_id, 
        mood, severity, lesson, action_plan, occurred_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [id, user_id, title, description, category_id, mood, severity, lesson, action_plan, occurred_at]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const userId = searchParams.get('userId');

  if (!id || !userId) {
    return NextResponse.json({ error: 'ID and User ID are required' }, { status: 400 });
  }

  try {
    await pool.query('DELETE FROM failures WHERE id = $1 AND user_id = $2', [id, userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
