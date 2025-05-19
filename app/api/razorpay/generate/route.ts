// app/razorpay/generate/route.ts
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { amount, packs } = body;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: amount * 100, // convert to paise
    currency: 'INR',
    receipt: `receipt_${packs}_packs_${Date.now()}`,
    notes: {
      packs: packs.toString(),
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

 
 export async function GET() {
    return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
  }