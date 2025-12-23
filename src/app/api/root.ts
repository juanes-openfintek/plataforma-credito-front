import axios from 'axios';
import { getSession } from 'next-auth/react';
import decryptData from '../helpers/decryptData';

/**
 * Obtiene los headers con autenticación
 */
async function getAuthHeaders() {
  const session: any = await getSession();
  
  if (!session?.user) {
    throw new Error('No authenticated session found');
  }

  const decryptedUser = await decryptData(session.user);
  const token = decryptedUser?.token;

  if (!token) {
    throw new Error('No authentication token found');
  }

  return {
    'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN || '',
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * GET request
 */
export async function getData(endpoint: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error in GET ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * POST request
 */
export async function postData(endpoint: string, data?: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
      data,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error in POST ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * PUT request
 */
export async function putData(endpoint: string, data?: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
      data,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error in PUT ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * DELETE request
 */
export async function deleteData(endpoint: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error in DELETE ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * PATCH request
 */
export async function patchData(endpoint: string, data?: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
      data,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error in PATCH ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

