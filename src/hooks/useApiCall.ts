/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { destroy, fetch, store, update } from '../utils/httpUtils';

interface Props {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    payload?: any;
    queryParams?: Record<any, any>;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}

function useApiCall(props: Props) {
    const { endpoint, method, payload, onSuccess, onError, queryParams } = props;

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [response, setResponse] = useState<any>();

    const CallApi = async (endpoint: string) => {
        setLoading(true);
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            let res;
            switch (method) {
                case 'GET':
                    res = await fetch(endpoint, payload, signal);
                    break;
                case 'POST':
                    res = await store(endpoint, payload, signal);
                    break;
                case 'PUT':
                    res = await update(endpoint, payload, signal);
                    break;
                case 'DELETE':
                    res = await destroy(endpoint, payload, signal);
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
            if (res?.status === 200) {
                setResponse(res?.data?.data);
                onSuccess && onSuccess(res?.data?.data);
            }
            return res;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                controller.abort();
                return;
            }
            onError && onError(err?.response);
            setError(err.response?.data?.data?.message);
        } finally {
            setLoading(false);
        }

        // Cleanup the controller on component unmount
        return () => controller.abort();
    };

    useEffect(() => {
        setError('');
        let finalEndpoint = endpoint;
        if (!endpoint) {
            return;
        }
        if (method === 'GET' && !endpoint) {
            return;
        }
        if (method !== 'GET' && !payload && !queryParams) {
            return;
        }

        if (queryParams && !Object.keys(queryParams).every((val) => queryParams[val] !== '')) {
            return;
        }
        if (queryParams && Object.keys(queryParams).every((val) => queryParams[val] !== '')) {
            let finalQueryParams = '';
            Object.keys(queryParams).forEach((val, ind) => {
                finalQueryParams += `${val}=${queryParams[val]}${Object.keys(queryParams).length - 1 !== ind ? '&' : ''}`;
            });

            finalEndpoint = `${endpoint}?${finalQueryParams}`;
        }
        CallApi(finalEndpoint);
    }, [endpoint, queryParams, refetch, payload]);

    return {
        CallApi,
        loading,
        setRefetch,
        refetch,
        response,
        error
    };
}

export default useApiCall;
