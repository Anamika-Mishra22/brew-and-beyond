const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// 1. Admin Alert Email Function
const sendReservationEmail = async (bookingData) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Brew & Beyond Cafe" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🚨 New Reservation: ${bookingData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #1c1917; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #b45309; padding-bottom: 8px;">
            ☕ New Table Booking Alert
          </h2>
          <p><strong>Customer Name:</strong> ${bookingData.name}</p>
          <p><strong>Customer Email:</strong> ${bookingData.email}</p>
          <p><strong>Date & Time:</strong> ${bookingData.dateTime}</p>
          <p><strong>Guests Count:</strong> ${bookingData.guests}</p>
          <p><strong>Seating Preference:</strong> ${bookingData.seating}</p>
          <p><strong>Special Request:</strong> ${bookingData.specialRequest || 'None'}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Reservation Email Sent Successfully to Admin!');
  } catch (error) {
    console.error('❌ Admin Email sending failed:', error);
  }
};
// Customer ko Status Update Email Bhejne Ka Function
const sendStatusUpdateEmail = async (userEmail, userName, status, dateTime) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🟢 SAFE CASE-INSENSITIVE CHECK (Trim aur Lowercase handling)
    const safeStatus = (status || '').toString().trim();
    const isConfirmed = safeStatus.toLowerCase() === 'confirmed';

    console.log(`📧 Sending status email to ${userEmail} | Status: "${safeStatus}" | isConfirmed: ${isConfirmed}`);

    const mailOptions = {
      from: `"Brew & Beyond Cafe" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: isConfirmed 
        ? `🎉 Table Booking Confirmed - Brew & Beyond` 
        : `❌ Table Booking Update - Brew & Beyond`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fcfbf7; color: #1c1917; border-radius: 12px; border: 1px solid #e7e5e4;">
          <h2 style="color: ${isConfirmed ? '#059669' : '#dc2626'}; border-bottom: 2px solid #e7e5e4; padding-bottom: 8px;">
            ${isConfirmed ? '✅ Reservation Confirmed!' : '❌ Reservation Cancelled'}
          </h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your table booking status for <strong>${dateTime}</strong> has been updated to:</p>
          <div style="padding: 10px 15px; background-color: ${isConfirmed ? '#d1fae5' : '#fee2e2'}; color: ${isConfirmed ? '#065f46' : '#991b1b'}; display: inline-block; font-weight: bold; border-radius: 8px; margin: 10px 0;">
            ${safeStatus.toUpperCase()}
          </div>
          <p>${isConfirmed 
            ? 'We look forward to serving you! Please arrive 5 minutes prior to your scheduled time.' 
            : 'We regret to inform you that we cannot accommodate your request at this time. Please try booking another time slot.'}
          </p>
          <br/>
          <p style="font-size: 12px; color: #78716c;">Regards,<br/><strong>Brew & Beyond Cafe Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Status Update Email sent to Customer (${userEmail})!`);
  } catch (error) {
    console.error('❌ Failed to send status email to customer:', error);
  }
};

module.exports = { sendReservationEmail, sendStatusUpdateEmail };