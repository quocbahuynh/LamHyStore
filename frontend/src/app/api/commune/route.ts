import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idDistrict = searchParams.get("idDistrict");

  // Validate required query parameter
  if (!idDistrict) {
    return Response.json(["Xảy ra lỗi"]);
  }

  const apiUrl = `https://vietnam-administrative-division-json-server-swart.vercel.app/commune?idDistrict=${encodeURIComponent(idDistrict)}`;

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
    return Response.json(["Xảy ra lỗi"]);
  }
}
