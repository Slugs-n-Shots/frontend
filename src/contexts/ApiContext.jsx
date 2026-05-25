import React, { createContext, useEffect, useMemo, useContext, useRef } from 'react';
import axios from 'axios';
import { useConfig } from 'contexts/ConfigContext';
import { useTranslation } from 'contexts/TranslationContext';
import { guestEndpoints, staffEndpoints } from 'src/api';

const CONFIG_KEY_TOKEN = 'token';

const ApiContext = createContext();

const getErrorMessage = (error) => {
  return error.response?.data?.message
    ?? error.response?.data?.error
    ?? error.response?.statusText
    ?? error.message;
};

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {

  const { language } = useTranslation();
  const { getConfig, realm, setConfig } = useConfig();
  const refreshPromiseRef = useRef(null);
  // console.log('realm', realm)
  const baseUrl = getConfig('serverURL');
  const endpoints = realm === 'staff' ? staffEndpoints : guestEndpoints;

  const api = useMemo(() => axios.create({
    baseURL: baseUrl
  }), [baseUrl]);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      async (_config) => {
        const token = getConfig(CONFIG_KEY_TOKEN)
        _config.params = { ..._config.params, lang: language }
        _config.baseURL = baseUrl;
        _config.headers.setContentType('application/json', true)
        if (token) {
          _config.headers.Authorization = `Bearer ${token}`;
        }
        return _config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      async response => {
        const token = response.data?.access_token;
        if (token) {
          setConfig(CONFIG_KEY_TOKEN, token);
        }
        return response
      },
      async (error) => {
        if (axios.isAxiosError(error)) {
          switch (error.code) {
            case 'ERR_NETWORK':
              error.statusText = error.message
              error.statusCode = 0
              break;
            case 'ERR_BAD_REQUEST':
            case 'ERR_BAD_RESPONSE':
              error.statusText = getErrorMessage(error)
              error.statusCode = '*' + error.request?.status
              break;
            default: break;
          }
          const originalRequest = error.config;
          const token = getConfig(CONFIG_KEY_TOKEN)

          if (error.code === 'ERR_BAD_REQUEST' && error.response?.status === 401 && originalRequest && !originalRequest._retry && token) {
            originalRequest._retry = true;
            try {
              if (!refreshPromiseRef.current) {
                refreshPromiseRef.current = axios.get(`${baseUrl}${endpoints.refresh}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }).finally(() => {
                  refreshPromiseRef.current = null;
                });
              }
              const response = await refreshPromiseRef.current;
              if (response.status === 200) {
                const token = response.data?.access_token;
                setConfig(CONFIG_KEY_TOKEN, token);
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
              } else {
                setConfig(CONFIG_KEY_TOKEN, null)
              }
            } catch (e) {
              console.warn('Refresh token invalid', e);
              setConfig(CONFIG_KEY_TOKEN, null)
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [api, baseUrl, endpoints.refresh, getConfig, language, setConfig]);

  const contextValue = useMemo(() => ({
    get: (url, config = {}) => api.get(url, config),
    post: (url, data, config = {}) => api.post(url, data, config),
    put: (url, data, config = {}) => api.put(url, data, config),
    deleteX: (url, config = {}) => api.delete(url, config),
  }), [api]);

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};
