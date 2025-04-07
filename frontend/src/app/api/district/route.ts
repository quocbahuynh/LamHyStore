import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idProvince = searchParams.get("idProvince");

  // Validate required query parameter
  if (!idProvince) {
    return Response.json(["Xảy ra lỗi"]);
  }

  const apiUrl = `https://vietnam-administrative-division-json-server-swart.vercel.app/district?idProvince=${encodeURIComponent(idProvince)}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return Response.json(["Xảy ra lỗi"]);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return Response.json(["Xảy ra lỗi"]);
  }
}
