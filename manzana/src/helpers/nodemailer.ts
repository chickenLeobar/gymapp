/*=============================================
TODO:
[ ] enviar mensaje
[ ] handlebars
[ ] facilitar el uso
[ ] reutilizacion de plantillas
[ ] programar email

=============================================*/
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import mjml from "mjml";
import nodemailer, { SendMailOptions } from "nodemailer";
export class EmailHandle {
  private static getHtmlEmailTemplate<T>(name: string, data: T) {
    const route = path.resolve(__dirname, `../templates/emails/${name}.mjml`);
    const source = fs.readFileSync(route, { encoding: "utf-8" });
    // compile mjml
    const mjmlHtml = mjml(source).html; // thml <p> hello  {{name}}</p>
    // console.log(mjmlHtml);
    const template = handlebars.compile(mjmlHtml); //<p> hello  {{name}}</p>
    const htmlResult = template(data);
    return htmlResult;
  }
  public static async sendEmail<T>(
    email: string,
    template: { name: string; data: T },
    subject?: string
  ) {
    const account = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    /**
     * Docs : https://mjml.io/
     * npm  : https://www.npmjs.com/package/mjml
     */
    const html = this.getHtmlEmailTemplate(template.name, template.data);
    const mailOptions: SendMailOptions = {
      from: '"hello wi" <usatloqueando@gmail.com>',
      to: email,
      subject: subject || "confirm password",
      html: html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`message send : ${info.messageId}`);
    console.log(`preview message :  ${nodemailer.getTestMessageUrl(info)}`);
    return;
  }
}
