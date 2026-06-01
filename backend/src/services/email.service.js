import nodemailer from "nodemailer";

/**
 * Tạo transporter nodemailer từ biến môi trường.
 * Hỗ trợ Gmail, SMTP tùy chỉnh hoặc Ethereal (test).
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
  }

  // Fallback: Gmail shorthand
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
  }

  // Dev fallback: log to console (không gửi thật)
  return null;
}

/**
 * Gửi OTP qua email.
 * @param {string} to - Địa chỉ email nhận
 * @param {string} code - Mã OTP 6 chữ số
 * @param {"register"|"change-password"|"forgot-password"} purpose
 */
export async function sendOtpEmail(to, code, purpose) {
  const purposeLabel = {
    register: "xác nhận đăng ký tài khoản",
    "change-password": "xác nhận đổi mật khẩu",
    "forgot-password": "đặt lại mật khẩu",
  }[purpose] || "xác thực";

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #050816; color: #e2e8f0; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
      <div style="background: linear-gradient(135deg, #16a34a, #059669); padding: 28px 32px;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #fff;">🏋️ FitAI</h1>
        <p style="margin: 6px 0 0; font-size: 14px; color: rgba(255,255,255,0.85);">Mã xác thực của bạn</p>
      </div>
      <div style="padding: 32px;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #94a3b8;">
          Bạn vừa yêu cầu <strong style="color: #e2e8f0;">${purposeLabel}</strong>. Sử dụng mã OTP dưới đây:
        </p>
        <div style="background: #0b1120; border: 1px solid rgba(74,222,128,0.2); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #4ade80; font-family: monospace;">${code}</span>
        </div>
        <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.6;">
          Mã có hiệu lực trong <strong style="color: #94a3b8;">10 phút</strong>.<br/>
          Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.
        </p>
      </div>
      <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #334155;">© 2026 FitAI. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  `;

  const transporter = createTransporter();

  if (!transporter) {
    // Môi trường dev: in ra console thay vì gửi email
    console.log(`\n📧 [DEV EMAIL] To: ${to} | Purpose: ${purpose} | OTP: ${code}\n`);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER,
    to,
    subject: `[FitAI] Mã OTP ${purposeLabel}: ${code}`,
    html,
  });
}
