import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Extract query parameters
  const { searchParams } = new URL(request.url);
  const province = searchParams.get("province");
  const district = searchParams.get("district");
  const pick_province = searchParams.get("pick_province");
  const pick_district = searchParams.get("pick_district");
  const weight = searchParams.get("weight");
  const deliver_option = searchParams.get("deliver_option");

  // Validate required query parameters
  if (
    !province ||
    !district ||
    !pick_province ||
    !pick_district ||
    !weight ||
    !deliver_option
  ) {
    return new Response(
      JSON.stringify({ error: "Missing required query parameters." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const token = process.env.GHTK_API_TOKEN || "";

  const apiUrl = `https://services.giaohangtietkiem.vn/services/shipment/fee?province=${encodeURIComponent(
    province,
  )}&district=${encodeURIComponent(district)}&pick_province=${encodeURIComponent(
    pick_province,
  )}&pick_district=${encodeURIComponent(pick_district)}&weight=${encodeURIComponent(
    weight,
  )}&deliver_option=${encodeURIComponent(deliver_option)}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Token: token,
      },
      redirect: "follow",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status });
    }

    const result = await response.text();
    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
