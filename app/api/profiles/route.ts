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
      'SELECT * FROM user_settings WHERE user_id = $1',
      [userId]
    );
    return NextResponse.json(result.rows[0] || null);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, custom_name, custom_avatar } = body;

    const result = await pool.query(
      `INSERT INTO user_settings (user_id, custom_name, custom_avatar, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
       custom_name = COALESCE(EXCLUDED.custom_name, user_settings.custom_name),
       custom_avatar = COALESCE(EXCLUDED.custom_avatar, user_settings.custom_avatar),
       updated_at = NOW()
       RETURNING *`,
      [user_id, custom_name || null, custom_avatar || null]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
