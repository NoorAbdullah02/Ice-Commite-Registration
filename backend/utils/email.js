// Banglish comments sudhu
// Ei file Brevo API diye email pathay

import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || '';
const FROM_NAME = process.env.BREVO_FROM_NAME || 'ICE Committee';

// Registration confirmation email pathay
export async function sendRegistrationEmail(full_name, email) {
  const payload = {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email, name: full_name }],
    subject: 'Form Received - ICE Committee',
    htmlContent: `
      <h2>Hello ${full_name},</h2>
      <p>Thanks for applying for ICE Committee. We will review your submission.</p>
      <p>Best regards,<br/>ICE Committee Team</p>
    `
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Registration email sent:', email);
    return response.data;
  } catch (error) {
    console.error('❌ Email send failed:', error.response?.data || error.message);
    throw error;
  }
}

// Selection confirmation email pathay
export async function sendSelectionEmail(full_name, email, position) {
  const payload = {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email, name: full_name }],
    subject: '🎉 Selected for Committee Position',
    htmlContent: `
      <h2>Hello ${full_name},</h2>
      <p>You are selected for the post of <strong>${position}</strong> in ICE Committee.</p>
      <p>Congratulations! We will contact you soon with more details.</p>
      <p>Best regards,<br/>ICE Committee Team</p>
    `
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Selection email sent:', email);
    return response.data;
  } catch (error) {
    console.error('❌ Email send failed:', error.response?.data || error.message);
    throw error;
  }
}

// Post update confirmation email pathay
export async function sendPostUpdateEmail(full_name, email, oldPost, newPost) {
  const payload = {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email, name: full_name }],
    subject: '📝 Your Committee Position Updated',
    htmlContent: `
      <h2>Hello ${full_name},</h2>
      <p>Your position for ICE Committee has been updated:</p>
      <p>
        <strong>Previous Position:</strong> ${oldPost}<br/>
        <strong>New Position:</strong> ${newPost}
      </p>
      <p>Thank you for your interest in ICE Committee!</p>
      <p>Best regards,<br/>ICE Committee Team</p>
    `
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Post update email sent:', email);
    return response.data;
  } catch (error) {
    console.error('❌ Email send failed:', error.response?.data || error.message);
    throw error;
  }
}
