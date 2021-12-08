import { Injectable } from '@nestjs/common';
import * as Axios from 'axios';
import * as Querystring from 'querystring';

export type QueryParams = string | Record<string, string | number | boolean | number[] | boolean[]>;

@Injectable()
export class HttpClient {
    private readonly baseOptions: Partial<Axios.AxiosRequestConfig>;

    constructor() {
        this.baseOptions = { responseType: 'json' };
    }

    public async request<T>(
        method: Axios.Method,
        url: string,
        queryParams?: QueryParams,
        body?: Record<string, unknown>,
        headers: object = {},
        options: Partial<Axios.AxiosRequestConfig> = {}
    ): Promise<T> {
        const sentHeaders = { ...headers };
        const params = typeof queryParams === 'string' ? queryParams : Querystring.stringify(queryParams);
        const startTime = Date.now();

        const axiosConfig: Axios.AxiosRequestConfig = {
            method,
            url,
            params,
            headers: sentHeaders,
            data: body,
            ...this.baseOptions,
            ...options,
        };

        try {
            return (await Axios.default.request(axiosConfig)).data;
        } catch (e) {
            const responseTime = Date.now() - startTime;

            // Default error
            let code = 'custom-http-error';
            let message = 'An error occured during a call to external api';
            let status = 500;
            let context = {};

            // Override if received error is a CustomError
            if (e instanceof CustomError) {
                code = e.code;
                if (e.status) status = e.status;
                if (e.name) message = e.message;
                if (e.context) context = e.context;
            }

            const error = new CustomError(code, message, status, { url, method, responseTime, ...context });

            Log.Logger.error(error);

            throw error;
        }
    }

    public async get<T>(
        url: string,
        queryParams?: QueryParams,
        headers: object = {},
        options: Partial<Axios.AxiosRequestConfig> = {}
    ): Promise<T> {
        return this.request<T>('get', url, queryParams, undefined, headers, options);
    }

    public async post<T>(
        url: string,
        body?: Record<string, unknown>,
        queryParams?: QueryParams,
        headers: object = {},
        options: Partial<Axios.AxiosRequestConfig> = {}
    ): Promise<T> {
        return this.request<T>('post', url, queryParams, body, headers, options);
    }

    public async put<T>(
        url: string,
        body?: Record<string, unknown>,
        queryParams?: QueryParams,
        headers: object = {},
        options: Partial<Axios.AxiosRequestConfig> = {}
    ): Promise<T> {
        return this.request<T>('put', url, queryParams, body, headers, options);
    }

    public async delete<T>(
        url: string,
        body?: Record<string, unknown>,
        queryParams?: QueryParams,
        headers: object = {},
        options: Partial<Axios.AxiosRequestConfig> = {}
    ): Promise<T> {
        return this.request<T>('delete', url, queryParams, body, headers, options);
    }

    public async options<T>(
        url: string,
        queryParams?: QueryParams,
        headers: object = {},
        options: Partial<Axios.AxiosRequestConfig> = {}
    ): Promise<T> {
        return this.request<T>('options', url, queryParams, undefined, headers, options);
    }

    public async patch<T>(
        url: string,
        body?: Record<string, unknown>,
        queryParams?: QueryParams,
        headers: object = {},
        options: Partial<Axios.AxiosRequestConfig> = {}
    ): Promise<T> {
        return this.request<T>('patch', url, queryParams, body, headers, options);
    }

    public async head(
        url: string,
        queryParams?: QueryParams,
        headers: object = {},
        options: Partial<Axios.AxiosRequestConfig> = {}
    ): Promise<void> {
        return this.request<void>('head', url, queryParams, undefined, headers, options);
    }
}
