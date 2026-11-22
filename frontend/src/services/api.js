// Voice of Customer Prioritization API Service
const API_BASE = 'http://localhost:8000';

export async function fetchFeatures() {
  try {
    const res = await fetch(`${API_BASE}/api/features`);
    if (!res.ok) throw new Error('Features fetch failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function updateRice(id, riceData) {
  try {
    const res = await fetch(`${API_BASE}/api/features/${id}/update-rice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(riceData)
    });
    if (!res.ok) throw new Error('Update failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}
