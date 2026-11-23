import { errorLogger, infoLogger } from "../../utils/loggers.js";
import {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_SMTP_PORT,
  EMAIL_USER,
  SEND_EMAILS,
} from "../../configs/email.config.js";
import { NODE_ENV } from "../../configs/serverConfig.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
class EmailService {
  constructor() {}
  async sendEmail({ to, subject, html, text }) {
    if (!SEND_EMAILS) return;
    try {
      const { data, error } = await resend.emails.send({
        from: "GERMANY-ASSIST <staging@germany-assist.com>",
        to: [to],
        subject: subject,
        html: html,
      });
      infoLogger(`📧 Email sent to ${to} for ${subject}`);
      if (error) {
        infoLogger(`📧 Error sending email to ${to} for ${subject}`);
        errorLogger(error);
      }
    } catch (err) {
      errorLogger(err);
      if (NODE_ENV !== "production") throw err;
      return;
    }
  }
}

export default new EmailService();
