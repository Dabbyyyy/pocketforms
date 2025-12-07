// src/api.js
import axios from 'axios';
import { API_BASE, JWT, USERNAME } from './config';

export const api = axios.create({
  baseURL: API_BASE.replace(/\/+$/, ''),
  headers: {
    Authorization: `Bearer ${JWT}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

api.interceptors.response.use(
  r => r,
  err => {
    const status = err?.response?.status;
    const data = err?.response?.data;
    console.log('[API ERROR]', status, data, 'URL:', err?.config?.url);
    return Promise.reject(err);
  }
);

/* ------------------ FORMS ------------------ */

export async function fetchForms() {
  const { data } = await api.get('/form', {
    params: { username: `eq.${USERNAME}`, order: 'id.asc', limit: 1000 },
  });
  return data;
}

export async function createForm(payload) {
  const body = { ...payload, username: USERNAME };
  const { data } = await api.post('/form', body, {
    headers: { Prefer: 'return=representation' },
  });
  return Array.isArray(data) ? data[0] : data;
}

export async function updateForm(id, payload) {
  const body = { ...payload, username: USERNAME };
  const { data } = await api.patch('/form', body, {
    params: { id: `eq.${id}`, username: `eq.${USERNAME}` },
    headers: { Prefer: 'return=representation' },
  });
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteForm(id) {
  try {
    // delete children first (avoids FK/RLS issues)
    await api.delete('/record', {
      params: { form_id: `eq.${id}`, username: `eq.${USERNAME}` },
      headers: { Prefer: 'return=minimal' },
    });
    await api.delete('/field', {
      params: { form_id: `eq.${id}`, username: `eq.${USERNAME}` },
      headers: { Prefer: 'return=minimal' },
    });
    await api.delete('/form', {
      params: { id: `eq.${id}`, username: `eq.${USERNAME}` },
      headers: { Prefer: 'return=minimal' },
    });
  } catch (e) {
    console.log('[DELETE FORM ERROR]', e?.response?.status, e?.response?.data);
    throw e;
  }
}

/* ------------------ FIELDS ------------------ */

export async function fetchFields(formId) {
  const { data } = await api.get('/field', {
    params: { form_id: `eq.${formId}`, username: `eq.${USERNAME}`, order: 'order_index.asc' },
  });
  return data;
}

export async function createField(payload) {
  const body = { username: USERNAME, order_index: 1, ...payload };
  const { data } = await api.post('/field', body, {
    headers: { Prefer: 'return=representation' },
  });
  return Array.isArray(data) ? data[0] : data;
}

export async function updateField(id, payload) {
  const body = { ...payload, username: USERNAME };
  const { data } = await api.patch('/field', body, {
    params: { id: `eq.${id}`, username: `eq.${USERNAME}` },
    headers: { Prefer: 'return=representation' },
  });
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteField(id) {
  await api.delete('/field', {
    params: { id: `eq.${id}`, username: `eq.${USERNAME}` },
    headers: { Prefer: 'return=minimal' },
  });
}

/* ------------------ RECORDS ------------------ */

export async function fetchRecords(formId, params = {}) {
  // order by id (table has no created_at)
  const base = { form_id: `eq.${formId}`, username: `eq.${USERNAME}`, order: 'id.desc' };
  const { data } = await api.get('/record', { params: { ...base, ...params } });
  return data;
}

export async function createRecord(payload) {
  const body = { username: USERNAME, ...payload };
  const { data } = await api.post('/record', body, {
    headers: { Prefer: 'return=representation' },
  });
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteRecord(id) {
  await api.delete('/record', {
    params: { id: `eq.${id}`, username: `eq.${USERNAME}` },
    headers: { Prefer: 'return=minimal' },
  });
}
