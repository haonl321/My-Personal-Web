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
      'SELECT * FROM todo_categories WHERE user_id = $1 ORDER BY created_at ASC',
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
    const { user_id, name, color, icon } = body;

    const result = await pool.query(
      `INSERT INTO todo_categories (user_id, name, color, icon)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, name, color, icon]
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
    await pool.query('DELETE FROM todo_categories WHERE id = $1 AND user_id = $2', [id, userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
