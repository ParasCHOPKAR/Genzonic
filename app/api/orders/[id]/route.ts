// /api/orders/[id]/route.ts

export async function PUT(req: Request, { params }: any) {
  await connectDB();

  const body = await req.json();

  const order = await Order.findByIdAndUpdate(
    params.id,
    { status: body.status },
    { new: true }
  );

  return NextResponse.json(order);
}