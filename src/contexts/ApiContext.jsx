import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useConfig } from 'contexts/ConfigContext';
import { useTranslation } from 'contexts/TranslationContext';

const CONFIG_KEY_TOKEN = 'token';

const ApiContext = createContext();

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {

  const { language } = useTranslation();
  const { getConfig, setConfig } = useConfig();
  // console.log('realm', realm)
  const baseUrl = getConfig('serverURL');

  const api = axios.create({
    baseURL: baseUrl
  });

  // Axios request interceptor for token renewal
  api.interceptors.request.use(
    async (_config) => {
      // Here you would fetch and attach the token from storage or state
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

  // Axios response interceptor to handle token expiration
  api.interceptors.response.use(
    async response => {
      const token = response.data?.access_token;
      if (token) {
        // console.log('token #1', token)
        setConfig(CONFIG_KEY_TOKEN, token);
      }
      return response
    },
    async (error) => {
      if (axios.isAxiosError(error)) {
        console.log('AxiosError', error)
        switch (error.code) {
          case 'ERR_NETWORK':
            error.statusText = error.message
            error.statusCode = 0
            console.log('AxiosError', 'NETWORK ERROR')
            break;
          case 'ERR_BAD_REQUEST':
            console.log(error.response.data);

            error.statusText = error.response.data.message
            error.statusCode = '*'+error.request.status
            console.log('AxiosError', 'Bad request')
            break;
          default: break;
        }
        const originalRequest = error.config;
        const token = getConfig(CONFIG_KEY_TOKEN)

        if (error.code === 'ERR_BAD_REQUEST' && error.response.status === 401 && !originalRequest._retry && token) {
          // Handle token renewal here, e.g., fetch a new token and set it
          originalRequest._retry = true;
          try {
            // Attempt to refresh the token
            // console.log("Érvénytelen token, frissíjük ", `${baseUrl}refresh`)
            // console.log("lejárt token", token)
            const response = await axios.get(`${baseUrl}refresh`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            if (response.status === 200) {
              // Store new token and update the original request
              const token = response.data?.access_token;
              // console.log('token #2', token)
              setConfig(CONFIG_KEY_TOKEN, token);
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              return api(originalRequest);
            } else {
              setConfig(CONFIG_KEY_TOKEN, null)
            }
          } catch (e) {
            console.warn('Refresh token invalid', e);
            // Handle the case where the refresh token is also invalid (e.g., logout the user)
          }
        }
      } else {
        console.log('Other Axios Error', error)
      }

      return Promise.reject(error);
    }
  );

  const contextValue = {
    get: (url, config = {}) => api.get(url, config),
    post: (url, data, config = {}) => api.post(url, data, config),
    put: (url, data, config = {}) => api.put(url, data, config),
    deleteX: (url, config = {}) => api.delete(url, config),
  };

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};
