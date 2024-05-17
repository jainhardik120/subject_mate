import { CheckToken, ErrorResponse } from '@/app/helpers';
import { sql } from '@vercel/postgres';

export async function POST(request : Request) {
  try {
    // Extract enrollment of the student from the request
    const { enrollment } = CheckToken(request);

    const authQuery = await sql`
      SELECT next_semester FROM auth WHERE enrollment = ${enrollment} LIMIT 1
    `;
    const currentSemester = authQuery.rows[0]?.next_semester;

    if (!currentSemester) {
      throw new Error('Student not found or semester not provided');
    }

    // Query the database to retrieve the list of categories for the current semester
    const categoriesQuery = await sql`
      SELECT * FROM categories WHERE semester = ${currentSemester}
    `;
    const categories = categoriesQuery.rows;

    return Response.json(categories);

  } catch (error) {
    return ErrorResponse(error, 500);
  }
}
