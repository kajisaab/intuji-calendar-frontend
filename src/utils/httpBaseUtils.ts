/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';

// Function to clear specific cookie by name
function clearCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function httpBase(signal?: any) {
    const normalHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': localStorage.getItem('access_token')
    };
    const api = axios.create({
        // Ensure the environment variable contains the correct base URL for your API
        baseURL: `http://localhost:3000/`,
        withCredentials: true,
        headers: normalHeaders,
        responseType: 'json',
        signal: signal
    });

    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    clearCookie('google_access_token');
                    clearCookie('refresh_token');
                    window.location.href = '/';
                }
            }

            return Promise.reject(error);
        }
    );

    return api;
}
