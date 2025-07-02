import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import PDFParser from 'pdf2json';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || !(file instanceof File)) {
      return new NextResponse('No valid file provided', { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const tempPath = path.join(os.tmpdir(), `${uuidv4()}.pdf`);

    await fs.writeFile(tempPath, fileBuffer);

    const parsedText: string = await new Promise((resolve, reject) => {
      const pdfParser = new (PDFParser as any)(null, 1);

      pdfParser.on('pdfParser_dataError', (err: any) => reject(err.parserError));
      pdfParser.on('pdfParser_dataReady', () => {
        const text = (pdfParser as any).getRawTextContent();
        resolve(text);
      });

      pdfParser.loadPDF(tempPath);
    });

    return NextResponse.json({ text: parsedText });
  } catch (error) {
    console.error('Parse error:', error);
    return new NextResponse('Failed to parse PDF', { status: 500 });
  }
}
