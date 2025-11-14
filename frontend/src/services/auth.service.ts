import api from "@/lib/api";
import { LoginPayload, LoginResponse, RegisterFormInputs, UserProfileResponse } from "@/types/auth";

class AuthService {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    const token = response.data.token;

    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return response.data as LoginResponse;
  }

  async register(payload: RegisterFormInputs): Promise<UserProfileResponse> {
    const response = await api.post<UserProfileResponse>("/auth/register", payload);
    return response.data as UserProfileResponse;
  }

  logout(): void {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

export default new AuthService();
