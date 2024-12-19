    
    
    
    import { createConnection } from '../../../../lib/db';
    import { NextResponse } from 'next/server';

    export async function GET(request) {
    try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const db = await createConnection();
    const sql = id ? "SELECT * FROM scanner WHERE id = ?" : "SELECT * FROM scanner";
    const [results] = await db.query(sql, id ? [id] : []);
     
    if (!results || results.length === 0) {
      return NextResponse.json({ error: id ? "Record not found" : "No records found" }, { status: 404 });
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}












































