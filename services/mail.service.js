const nodemailer = require("nodemailer");
const config = require("config")


class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password")
      },
    })
  }
  async sendMailActivateCode(toEmail, link) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "Activate ITINFO account",
      text: "",
      html: `
        <div>
          <h2>Please, enter the link below to activate your account</h2>
          <a href="${link}" style="text-decoration: none;">
            <button style="padding: 10px 20px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Activate Account
            </button>
          </a>
        </div>
      `
    })  
  }
}




module.exports = new MailService();