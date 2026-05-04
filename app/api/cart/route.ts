export async function POST(req: Request) {

  const body = await req.json();

  const { userId, productId } = body;

  // Add product to cart

}