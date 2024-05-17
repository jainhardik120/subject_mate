import { CheckToken, ErrorResponse } from '@/app/helpers';
import { sql } from '@vercel/postgres';
export async function POST(request: Request, { params }: { params: { category: string } }) {
  try {
    // Extract the category name from the request params
    const { category } = params;

    // Query the database to retrieve the list of subjects for the specified category
    const subjectsQuery = await sql`
      SELECT * FROM subjects WHERE category_id = (
        SELECT id FROM categories WHERE category_name = ${category}
      )
    `;
    
    const subjects = subjectsQuery.rows;

    // Return the list of subjects as a success response
    return Response.json({subjects});

  } catch (error) {
    // Return error response
    return ErrorResponse(error, 500);
  }
}
