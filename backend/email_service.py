import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_recovery_email(receiver_email: str, pin: str):
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))

    if not sender_email or not sender_password:
        print("ADVERTENCIA: Credenciales de correo no configuradas. Simulando envío.")
        print(f"--- EMAIL A {receiver_email} ---")
        print(f"Tu PIN de recuperación es: {pin}")
        print("-------------------------------")
        return True

    message = MIMEMultipart("alternative")
    message["Subject"] = "Recuperación de Acceso - Ola Coffee Menú"
    message["From"] = sender_email
    message["To"] = receiver_email

    text = f"""\
    Hola,
    
    Se ha solicitado recuperar el acceso al panel de administración de Ola Coffee Menú.
    Tu PIN temporal es: {pin}
    
    Este PIN es válido por 15 minutos. Si no solicitaste este cambio, simplemente ignora este correo. La contraseña actual sigue siendo válida.
    """
    
    html = f"""\
    <html>
      <body>
        <p>Hola,</p>
        <p>Se ha solicitado recuperar el acceso al panel de administración de <b>Ola Coffee Menú</b>.</p>
        <p>Tu PIN temporal es: <b style="font-size: 24px;">{pin}</b></p>
        <p>Este PIN es válido por 15 minutos.</p>
        <p><small>Si no solicitaste este cambio, simplemente ignora este correo. La contraseña actual sigue siendo válida.</small></p>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    message.attach(part1)
    message.attach(part2)

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Error enviando correo: {e}")
        return False
