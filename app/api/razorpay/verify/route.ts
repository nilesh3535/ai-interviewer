// app/api/razorpay/verify/route.ts
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { insertOrder, insertTransaction, updateWallet } from '@/lib/actions/auth.action';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { paymentId, orderId, userId, packs, amount,oldBalance,packType } = body;

  try {
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== 'captured') {
      return NextResponse.json({ success: false, error: 'Payment not captured.' });
    }

    await insertOrder({
      paymentid: paymentId,
      orderid:orderId,
      amount: String(amount),
      packs: String(packs),     
      paymentType: payment.method, // card, upi, netbanking etc.
      oldBalance:oldBalance,
      remaining:(parseInt(oldBalance)+parseInt(packs)).toString(),
      userId,
      packType:packType
    });
    await insertTransaction({
      paymentid: paymentId,
      orderid:orderId,
      type:"Credited",
      amount: String(amount),
      packs: String(packs),     
      paymentType: payment.method, // card, upi, netbanking etc.
      oldBalance:oldBalance,
      remaining:(parseInt(oldBalance)+parseInt(packs)).toString(),
      userId,
      packType:packType
    });
    //update wallet fetch existring wallet balance and plus new  from users table users
    await updateWallet({packs:(parseInt(oldBalance)+parseInt(packs)).toString(),userId})

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment verification failed", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
