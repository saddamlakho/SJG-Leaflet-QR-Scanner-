
import { createConnection } from '../../../../lib/db';
import { NextResponse } from 'next/server';
export async function PUT(request) {
  try {
    const body = await request.json();
    const { ID, SAP_ID, productName, Date, qr_code } = body;

  
    if (!ID || !SAP_ID || !productName || !Date || !qr_code) {
      return NextResponse.json(
        { error: 'All fields are required (ID, SAP_ID, productName, Date, qr_code)' },
        { status: 400 }
      );
    }

    const db = await createConnection();

  
    const sql = `UPDATE scanner SET SAP_ID = ?, productName = ?, Date = ?, qr_code = ? WHERE ID = ?`;
    const [result] = await db.query(sql, [SAP_ID, productName, Date, qr_code, ID]);

   
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Update failed, record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}