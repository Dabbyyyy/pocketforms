// src/utils.js

// Field types used by the app (Fields screen)
export const FIELD_TYPES = ['text', 'multiline', 'dropdown', 'location', 'image'];

/**
 * Client-side validator: only text/multiline can be numeric.
 * values: { [fieldName]: any }
 * fields: array of field definitions from the API
 */
export function validateRecord(values, fields) {
  const errors = {};
  const numericOK = new Set(['text', 'multiline']); // only these types can be numeric

  for (const f of (fields || [])) {
    const v = values?.[f.name];

    // required
    if (f.required && (v === undefined || v === null || v === '')) {
      errors[f.name] = 'Required';
      continue;
    }

    // numeric validation only for text-ish fields
    if (f.is_num && numericOK.has(f.field_type)) {
      if (v !== undefined && v !== null && v !== '') {
        const n = Number(v);
        if (Number.isNaN(n)) errors[f.name] = 'Must be a number';
      }
    }
  }
  return errors;
}

/* ----------------- Location helpers (for Map screen) ----------------- */

/** True if the form has at least one location field */
export function hasLocationField(fields) {
  return Array.isArray(fields) && fields.some(f => f.field_type === 'location');
}

/** Returns the first location field name (or null if none) */
export function getLocationFieldName(fields) {
  const f = Array.isArray(fields) ? fields.find(x => x.field_type === 'location') : null;
  return f?.name ?? null;
}
// Back-compat alias in case map.js imports a different name
export const getLocationField = getLocationFieldName;

/**
 * parseLocation(value)
 * Accepts:
 *   - object { lat, long }  (preferred)
 *   - object { latitude, longitude }
 *   - JSON string of the above
 * Returns: { latitude: number, longitude: number } | null
 */
export function parseLocation(value) {
  let v = value;
  if (!v) return null;

  if (typeof v === 'string') {
    try { v = JSON.parse(v); } catch { return null; }
  }

  if (v && typeof v === 'object') {
    // Support {lat,long} or {latitude,longitude}
    const lat  = v.lat  ?? v.latitude;
    const long = v.long ?? v.lng ?? v.longitude;

    const latitude  = Number(lat);
    const longitude = Number(long);

    if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
      return { latitude, longitude };
    }
  }

  return null;
}

/**
 * extractLatLng(record, fieldName)
 * Convenience: pull and parse a location from a record object.
 */
export function extractLatLng(record, fieldName) {
  const raw = record?.values?.[fieldName];
  return parseLocation(raw);
}
