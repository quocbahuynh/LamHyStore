import apiLinks from "@/utils/api-links";

export interface Token {
  accessToken: string;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  createdDate: string; // Consider changing to `Date` if handling as a Date object
  role: string; // Define the role of the admin (e.g., admin, superadmin, etc.)
  lastLogin: string;
  permissions: string[]; // Permissions granted to the admin
}

const login = async (
  phoneNumber: string,
  password: string,
): Promise<string> => {
  const response = await fetch(apiLinks.admin.login, {
    method: "POST", // Specify the request method
    headers: {
      "Content-Type": "application/json", // Ensure the body is sent as JSON
    },
    body: JSON.stringify({
      phoneNumber,
      password, // Pass the parameters as the JSON payload
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Login failed: ${response.status} - ${response.statusText}`,
    );
  }

  const data = await response.json(); // Parse the JSON response
  return data.accessToken as string; // Ensure it matches the expected type
};

const getProfile = async (token: string): Promise<Admin> => {
  const response = await fetch(apiLinks.authentication.profile, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer token
      "Content-Type": "application/json", // Optional, depending on your API
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch profile: ${response.status} - ${response.statusText}`,
    );
  }

  const data = await response.json(); // Parse the JSON response
  return data as Admin; // Return the admin profile data
};

const adminAuthService = {
  login,
  getProfile,
};

export default adminAuthService;
