// // Banglish comments sudhu
// // Ei file Brevo API diye email pathay

// import axios from 'axios';

// const BREVO_API_KEY = process.env.BREVO_API_KEY;
// const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || '';
// const FROM_NAME = process.env.BREVO_FROM_NAME || 'ICE Committee';

// // Registration confirmation email pathay
// export async function sendRegistrationEmail(full_name, email) {
//   const payload = {
//     sender: { name: FROM_NAME, email: FROM_EMAIL },
//     to: [{ email, name: full_name }],
//     subject: 'Form Received - ICE Committee',
//     htmlContent: `
//       <h2>Hello ${full_name},</h2>
//       <p>Thanks for applying for ICE Committee. We will review your submission.</p>
//       <p>Best regards,<br/>ICE Committee Team</p>
//     `
//   };

//   try {
//     const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
//       headers: {
//         'api-key': BREVO_API_KEY,
//         'Content-Type': 'application/json'
//       }
//     });
//     console.log('✅ Registration email sent:', email);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Email send failed:', error.response?.data || error.message);
//     throw error;
//   }
// }

// // Selection confirmation email pathay
// export async function sendSelectionEmail(full_name, email, position) {
//   const payload = {
//     sender: { name: FROM_NAME, email: FROM_EMAIL },
//     to: [{ email, name: full_name }],
//     subject: '🎉 Selected for Committee Position',
//     htmlContent: `
//       <h2>Hello ${full_name},</h2>
//       <p>You are selected for the post of <strong>${position}</strong> in ICE Committee.</p>
//       <p>Congratulations! We will contact you soon with more details.</p>
//       <p>Best regards,<br/>ICE Committee Team</p>
//     `
//   };

//   try {
//     const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
//       headers: {
//         'api-key': BREVO_API_KEY,
//         'Content-Type': 'application/json'
//       }
//     });
//     console.log('✅ Selection email sent:', email);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Email send failed:', error.response?.data || error.message);
//     throw error;
//   }
// }


// // Post update confirmation email pathay
// export async function sendPostUpdateEmail(full_name, email, oldPost, newPost) {
//   const payload = {
//     sender: { name: FROM_NAME, email: FROM_EMAIL },
//     to: [{ email, name: full_name }],
//     subject: '📝 Your Committee Position Updated',
//     htmlContent: `
//       <h2>Hello ${full_name},</h2>
//       <p>Your position for ICE Committee has been updated:</p>
//       <p>
//         <strong>Previous Position:</strong> ${oldPost}<br/>
//         <strong>New Position:</strong> ${newPost}
//       </p>
//       <p>Thank you for your interest in ICE Committee!</p>
//       <p>Best regards,<br/>ICE Committee Team</p>
//     `
//   };

//   try {
//     const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
//       headers: {
//         'api-key': BREVO_API_KEY,
//         'Content-Type': 'application/json'
//       }
//     });
//     console.log('✅ Post update email sent:', email);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Email send failed:', error.response?.data || error.message);
//     throw error;
//   }
// }






// Ei file Brevo API diye email pathay - Modern aar gorgeous design e

import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || '';
const FROM_NAME = process.env.BREVO_FROM_NAME || 'ICE Committee';

// Modern email template er base structure
const getEmailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 24px; color: #333; margin-bottom: 20px; font-weight: 600; }
    .message { color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 25px; }
    .highlight-box { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 15px; margin: 25px 0; color: white; box-shadow: 0 5px 15px rgba(240, 147, 251, 0.3); }
    .highlight-box h3 { margin: 0 0 15px 0; font-size: 20px; }
    .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.3); }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; opacity: 0.9; }
    .info-value { font-weight: 400; }
    .button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; margin: 20px 0; font-weight: 600; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); transition: transform 0.3s; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    .footer-links { margin: 15px 0; }
    .footer-links a { color: #667eea; text-decoration: none; margin: 0 10px; }
    .social-icons { margin: 20px 0; }
    .social-icons a { display: inline-block; margin: 0 8px; width: 40px; height: 40px; background: #667eea; border-radius: 50%; line-height: 40px; color: white; text-decoration: none; }
    .divider { height: 3px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); margin: 30px 0; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #333;">ICE Committee</p>
      <p style="margin: 0 0 15px 0;">Your journey to excellence starts here</p>
      <div class="divider" style="max-width: 100px; margin: 20px auto;"></div>
      <div class="footer-links">
        <a href="#">About Us</a> | 
        <a href="#">Contact</a> | 
        <a href="#">FAQs</a>
      </div>
      <div class="social-icons">
        <a href="#" title="Facebook">f</a>
        <a href="#" title="Twitter">t</a>
        <a href="#" title="LinkedIn">in</a>
        <a href="#" title="Instagram">ig</a>
      </div>
      <p style="margin: 20px 0 0 0; font-size: 12px; color: #999;">
        © 2025 ICE Committee. All rights reserved.<br/>
        This is an automated message, please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Registration confirmation email pathay
export async function sendRegistrationEmail(full_name, email, studentData) {
  const content = `
    <div class="header">
      <h1>✨ Application Received!</h1>
      <p>Welcome to ICE Committee Selection Process</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${full_name}! 👋</div>
      <div class="message">
        <p>Thank you for applying to join the <strong>ICE Committee</strong>! We're excited to review your application and get to know you better.</p>
        <p>Your application has been successfully submitted and is now under review by our selection team.</p>
      </div>
      
      <div class="highlight-box">
        <h3>📋 Application Summary</h3>
        <div class="info-row">
          <span class="info-label">Applied Position:</span>
          <span class="info-value">${studentData.apply_for_post}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Student ID:</span>
          <span class="info-value">${studentData.ID_no}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Department:</span>
          <span class="info-value">${studentData.department}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Batch:</span>
          <span class="info-value">${studentData.batch || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value">${studentData.phone}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Submitted:</span>
          <span class="info-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="message">
        <h3 style="color: #667eea; margin-bottom: 15px;">🎯 What's Next?</h3>
        <ul style="padding-left: 20px; color: #555;">
          <li style="margin: 10px 0;">Our selection committee will carefully review all applications</li>
          <li style="margin: 10px 0;">We'll evaluate candidates based on skills, experience, and enthusiasm</li>
          <li style="margin: 10px 0;">You'll receive an email notification about your selection status</li>
          <li style="margin: 10px 0;">Selected candidates will be contacted for the next steps</li>
        </ul>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea;">
        <p style="margin: 0; color: #555; font-style: italic;">
          <strong>💡 Pro Tip:</strong> Keep an eye on your email inbox! We'll be sending updates about your application status.
        </p>
      </div>

      <div class="message" style="text-align: center;">
        <p style="font-size: 18px; color: #333; font-weight: 600;">Best of luck with your application! 🌟</p>
        <p style="color: #666;">We appreciate your interest in joining our committee.</p>
      </div>
    </div>
  `;

  const payload = {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email, name: full_name }],
    subject: '✨ Application Received - ICE Committee Selection',
    htmlContent: getEmailTemplate(content)
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
export async function sendSelectionEmail(full_name, email, position, studentData) {
  const content = `
    <div class="header">
      <h1>🎉 Congratulations!</h1>
      <p>You've Been Selected for ICE Committee</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${full_name}! 🎊</div>
      <div class="message">
        <p style="font-size: 18px; color: #333; line-height: 1.8;">
          We are <strong>thrilled</strong> to inform you that after careful consideration of all applications, 
          you have been <strong style="color: #667eea;">selected</strong> to join the ICE Committee!
        </p>
      </div>
      
      <div class="highlight-box">
        <h3>🏆 Your Position</h3>
        <div style="text-align: center; padding: 20px 0;">
          <div style="font-size: 32px; font-weight: 700; margin-bottom: 10px;">${position}</div>
          <div style="opacity: 0.9;">ICE Committee 2025</div>
        </div>
        <div class="divider" style="background: rgba(255,255,255,0.3); margin: 20px 0;"></div>
        <div class="info-row">
          <span class="info-label">Student ID:</span>
          <span class="info-value">${studentData?.ID_no || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Department:</span>
          <span class="info-value">${studentData?.department || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Contact:</span>
          <span class="info-value">${studentData?.phone || email}</span>
        </div>
      </div>

      <div class="message">
        <h3 style="color: #667eea; margin-bottom: 15px;">📅 Next Steps</h3>
        <ul style="padding-left: 20px; color: #555;">
          <li style="margin: 12px 0;"><strong>Orientation Meeting:</strong> Details will be shared via email within 3-5 days</li>
          <li style="margin: 12px 0;"><strong>Committee Introduction:</strong> Meet your fellow committee members</li>
          <li style="margin: 12px 0;"><strong>Role Briefing:</strong> Learn about your responsibilities and expectations</li>
          <li style="margin: 12px 0;"><strong>Resource Access:</strong> Gain access to committee platforms and tools</li>
        </ul>
      </div>

      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 15px; margin: 25px 0; color: white; text-align: center;">
        <p style="margin: 0; font-size: 18px; font-weight: 600;">
          🌟 Your journey with ICE Committee begins now! 🌟
        </p>
        <p style="margin: 15px 0 0 0; opacity: 0.9;">
          We look forward to your valuable contributions and leadership.
        </p>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; color: #333; font-weight: 600;">📞 Need Help?</p>
        <p style="margin: 0; color: #666; font-size: 14px;">
          If you have any questions or concerns, feel free to reach out to us at <a href="mailto:${FROM_EMAIL}" style="color: #667eea;">${FROM_EMAIL}</a>
        </p>
      </div>

      <div class="message" style="text-align: center; margin-top: 30px;">
        <p style="font-size: 20px; color: #333; font-weight: 600;">Welcome to the team! 🚀</p>
      </div>
    </div>
  `;

  const payload = {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email, name: full_name }],
    subject: '🎉 Congratulations! You\'re Selected - ICE Committee',
    htmlContent: getEmailTemplate(content)
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
export async function sendPostUpdateEmail(full_name, email, oldPost, newPost, studentData) {
  const content = `
    <div class="header">
      <h1>📝 Position Updated</h1>
      <p>Your Committee Role Has Changed</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${full_name}! 👋</div>
      <div class="message">
        <p>We're writing to inform you about an update to your position in the ICE Committee.</p>
        <p>After reviewing committee requirements and your profile, we've made the following change:</p>
      </div>
      
      <div class="highlight-box">
        <h3>🔄 Position Change</h3>
        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin: 15px 0;">
          <div style="opacity: 0.8; font-size: 14px; margin-bottom: 8px;">Previous Position:</div>
          <div style="font-size: 20px; font-weight: 600; text-decoration: line-through; opacity: 0.7;">${oldPost}</div>
        </div>
        <div style="text-align: center; font-size: 24px; margin: 15px 0;">⬇️</div>
        <div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 10px; margin: 15px 0;">
          <div style="opacity: 0.8; font-size: 14px; margin-bottom: 8px;">New Position:</div>
          <div style="font-size: 24px; font-weight: 700;">${newPost}</div>
        </div>
        <div class="divider" style="background: rgba(255,255,255,0.3); margin: 20px 0;"></div>
        <div class="info-row">
          <span class="info-label">Student ID:</span>
          <span class="info-value">${studentData?.ID_no || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Updated On:</span>
          <span class="info-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div class="message">
        <h3 style="color: #667eea; margin-bottom: 15px;">ℹ️ What This Means</h3>
        <ul style="padding-left: 20px; color: #555;">
          <li style="margin: 10px 0;">Your new role comes with updated responsibilities</li>
          <li style="margin: 10px 0;">You'll receive additional information about your position</li>
          <li style="margin: 10px 0;">All committee benefits and privileges remain active</li>
          <li style="margin: 10px 0;">We're confident this role suits your skills perfectly</li>
        </ul>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea;">
        <p style="margin: 0 0 10px 0; color: #333; font-weight: 600;">💬 Questions or Concerns?</p>
        <p style="margin: 0; color: #666;">
          If you have any questions about this change or would like to discuss your new role, 
          please don't hesitate to contact us at <a href="mailto:${FROM_EMAIL}" style="color: #667eea;">${FROM_EMAIL}</a>
        </p>
      </div>

      <div class="message" style="text-align: center;">
        <p style="font-size: 18px; color: #333;">We appreciate your continued dedication to ICE Committee! 🌟</p>
      </div>
    </div>
  `;

  const payload = {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email, name: full_name }],
    subject: '📝 Your ICE Committee Position Has Been Updated',
    htmlContent: getEmailTemplate(content)
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

