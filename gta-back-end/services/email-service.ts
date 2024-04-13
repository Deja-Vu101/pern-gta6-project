import { PrismaClient } from "@prisma/client";
import nodemailer, { Transporter } from "nodemailer";
import { ApiError } from "../exceptions/api-error";

const prisma = new PrismaClient();
class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      port: Number(process.env.SMTP_PORT),
      host: process.env.SMTP_HOST,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  async sendLetter(email: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Account activation on the site GTA6",
      text: "",
      html: `<div>
      	<h1>To activate follow the link</h1>
      <a href=${link}>${link}</a>
      	 </div> `,
    });
  }

  async activateAccount(activationLink: string) {
    const userActivationLink = await prisma.user.findFirst({
      where: {
        activationLink: activationLink,
      },
    });

    if (!userActivationLink)
      throw ApiError.BadRequest("User is missing from this activation link");

    await prisma.user.update({
      where: {
        id: userActivationLink.id,
      },
      data: {
        isActivated: true,
      },
    });
  }
}

export default new EmailService();
