import {
    ApiResponse,
    AuthResponse,
    LoginInput,
    RegisterInput,
    User,
    Product,
    PaginatedResponse,
    CreateProductInput,
    UpdateProductInput,
    UpdateScoreInput,
    CategoryStats,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
    private getHeaders(includeAuth: boolean = false): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    }

    private setToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('token', token);
    }

    private removeToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('token');
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...this.getHeaders(false),
                    ...options.headers,
                },
            });

            const data: ApiResponse<T> = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'API request failed');
            }

            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Network error');
        }
    }

    // ==================== 인증 API ====================

    async register(input: RegisterInput): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(input),
        });

        if (response.data?.token) {
            this.setToken(response.data.token);
        }

        return response.data!;
    }

    async login(input: LoginInput): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(input),
        });

        if (response.data?.token) {
            this.setToken(response.data.token);
        }

        return response.data!;
    }

    async getCurrentUser(): Promise<User> {
        const response = await this.request<User>('/auth/me', {
            headers: this.getHeaders(true),
        });

        return response.data!;
    }

    logout(): void {
        this.removeToken();
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // ==================== 상품 API ====================

    async getProducts(params?: {
        page?: number;
        limit?: number;
        category?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: string;
        search?: string;
    }): Promise<PaginatedResponse<Product>> {
        const queryParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, String(value));
                }
            });
        }

        const queryString = queryParams.toString();
        const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

        const response = await this.request<PaginatedResponse<Product>>(endpoint, {
            headers: this.getHeaders(true),
        });

        return response.data!;
    }

    async getProduct(id: string): Promise<Product> {
        const response = await this.request<Product>(`/products/${id}`, {
            headers: this.getHeaders(true),
        });

        return response.data!;
    }

    async createProduct(input: CreateProductInput): Promise<Product> {
        const response = await this.request<Product>('/products', {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(input),
        });

        return response.data!;
    }

    async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
        const response = await this.request<Product>(`/products/${id}`, {
            method: 'PATCH',
            headers: this.getHeaders(true),
            body: JSON.stringify(input),
        });

        return response.data!;
    }

    async deleteProduct(id: string): Promise<void> {
        await this.request(`/products/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(true),
        });
    }

    async updateProductScore(id: string, scores: UpdateScoreInput): Promise<Product> {
        const response = await this.request<Product>(`/products/${id}/score`, {
            method: 'PATCH',
            headers: this.getHeaders(true),
            body: JSON.stringify(scores),
        });

        return response.data!;
    }

    async getCategoryStats(): Promise<CategoryStats[]> {
        const response = await this.request<CategoryStats[]>('/products/stats/categories', {
            headers: this.getHeaders(true),
        });

        return response.data!;
    }
}

export const api = new ApiClient();
