import apiLinks from "@/utils/api-links";
import { NextRequest } from "next/server";

let branchesData: any[] = []; // Temporary in-memory storage

export async function GET(request: NextRequest) {
  try {
    if (branchesData.length > 0) {
      return Response.json(branchesData);
    }
    const response = await fetch(apiLinks.branches.getFull);

    const data = await response.json();
    branchesData = data;
    return Response.json(data);
  } catch (error) {
    return Response.json(["Xảy ra lỗi"]);
  }
}
