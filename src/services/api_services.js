import axios from 'axios';

// import { useSnackbar } from 'src/components/snakbar/SnackbarContext'; 

import useAuthToken from './user_auth_token';

const API_BASE_URL = 'https://pgedgecloud.onrender.com/services';

const ApiService = () => {
    const token = useAuthToken();
    // const { showSnackbar } = useSnackbar();
    console.log(token);

    const connectionCheck = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    };


    const getHeaders = () => {
        console.log(token);
        if (token !== null && token !== "") {
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        }
        return {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        };
    }

    const signin = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signin`, data);
            console.log(response.data);
            return response.data; // This will include the response data, status, and other information
        } catch (error) {
            // Handle or throw the error as needed
            console.error('Error fetching users:', error);
            throw error;
        }
    };

    const register = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
            console.log(response.data);
            return response.data; // This will include the response data, status, and other information
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    };


    const getUserInfo = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/appuser/get`, {
                headers: getHeaders()
            });
            console.log(response.data);
            return response.data; // This will include the response data, status, and other information
        } catch (error) {
            console.log('Error fetching users:', error);
            throw error;
        }
    };

    const createAcc = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/account/save`, data, {
                headers: getHeaders()
            });
            return response.data; // This will include the response data, status, and other information
        } catch (error) {
            console.log('Error fetching users:', error);
            throw error;
        }
    };

    const updateAcc = async (data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/account/update`, data, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.log('Error fetching users:', error);
            throw error;
        }
    };

    const getAccount = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/account/get`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.log('Error fetching users:', error.message);
            throw error;
        }
    };
    //  ========================= Transactions ==========================

    const addTransaction = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/transaction/save`, data, {
                headers: getHeaders()
            });
            console.log(response.data);
            return response.data; // This will include the response data, status, and other information
        } catch (error) {
            console.log('Error fetching users:', error);

            throw error;
        }
    };
    const getUserTransaction = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/transaction/get/user`, {
                headers: getHeaders()
            });
            console.log('transaction', response.data);
            return response.data;
        } catch (error) {
            console.log('Error fetching users:', error.message);
            throw error;
        }
    };
    return { connectionCheck, getUserInfo, register, signin, createAcc, getAccount, updateAcc, addTransaction, getUserTransaction };
}


export default ApiService;