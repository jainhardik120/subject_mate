import { CheckToken, ErrorResponse } from '@/app/helpers';
import { sql } from '@vercel/postgres';

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    const { category } = params;
    const {enrollment } = await CheckToken(request);

    const subjectsQuery = await sql`
      SELECT * FROM subjects WHERE category_id = ${category}
    `;
    
    const subjects = subjectsQuery.rows;

    return Response.json({subjects});

  } catch (error) {
    return ErrorResponse(error, 500);
  }
}
