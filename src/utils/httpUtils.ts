/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpBase } from './httpBaseUtils';

export function fetch(endpoint: any, data?: any, signal?: any) {
    return httpBase(signal).get(`/${endpoint}`, data);
}

export function store(endpoint: any, data: any, signal?: any) {
    return httpBase(signal).post(`/${endpoint}`, data);
}

export function update(endpoint: any, data?: any, signal?: any) {
    return httpBase(signal).put(`/${endpoint}`, data);
}

export function destroy(endpoint: any, data?: Record<string, any>, signal?: any) {
    return httpBase(signal).delete(`/${endpoint}`, { data });
}
