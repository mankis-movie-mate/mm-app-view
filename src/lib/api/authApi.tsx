import {AuthResponse} from "@/types/auth";
import {fetchApi} from "@/lib/api/fetchApi";


export interface LoginInput {
    identifier: string;
    password: string;
}


export async function login(data: LoginInput): Promise<AuthResponse> {
    return fetchApi<AuthResponse>(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export interface RegisterInput {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export async function register(
    data: RegisterInput
): Promise<AuthResponse> {
    return fetchApi<AuthResponse>(`${process.env.NEXT_PUBLIC_AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}