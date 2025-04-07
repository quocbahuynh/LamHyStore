import { NextRequest } from "next/server";

let provincesData: any[] = []; // Temporary in-memory storage

export async function GET(request: NextRequest) {
  try {
    if (provincesData.length > 0) {
      return Response.json(provincesData);
    }
    const response = await fetch(
      "https://vietnam-administrative-division-json-server-swart.vercel.app/province",
    );

    const data = await response.json();
    provincesData = data;
    return Response.json(data);
  } catch (error) {
    return Response.json(["Xảy ra lỗi"]);
  }
}
