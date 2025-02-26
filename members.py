from pymongo import MongoClient
import hashlib
import random
import string
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


# 會員功能
class Member:
    # 註冊
    def register(self,json_data):
        if isinstance(json_data, dict):
            data = json_data
        else:
            data = json.loads(json_data)
        randomnum = ''.join(random.choices(string.ascii_letters + string.digits,k=8))
        password = hashlib.sha256((data['password']+randomnum).encode()).hexdigest()
        data['password'] = password
        data['randomnum'] = randomnum
        print(randomnum)
        print(password)
        return data
    # 會員驗證信
    def send_mail(self,user_email,username,verification_code):
        # 寄件者
        smtp_server = 'smtp.gmail.com'
        smtp_port = 587
        gmail_user = 'chuntingliu0403@gmail.com'
        gmail_pwd = 'hbqbvcaercmptwoa'
        # mail內容
        subject = 'Member registration verification email'
        body = f"""
                    <h2>Dear {username},</h2>
                    <p>Thank you for registering as a member of our website.</p>
                    <p>Please enter the verification code below to complete the registration process:</p>
                    <p><strong><span style="color:red;">{verification_code}</span></strong></p>
                    <p>If you did not register, please ignore this email.</p>
                    <p>Best regards,<br>American Stock Team</p>
                    """
        msg = MIMEMultipart()
        msg['From'] = gmail_user
        msg['To'] = user_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))

        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(gmail_user, gmail_pwd)
            server.sendmail(gmail_user, user_email, msg.as_string())
            print(f'Send mail successfully to {user_email}')
        except Exception as e:
            print(f'Failed to send mail to {user_email}')
            print(e)

        uri = "mongodb+srv://american-stock.w9ior.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=American-stock"
        client = MongoClient(uri,
                     tls=True,
                     tlsCertificateKeyFile= "C:\\Users\\USER\\Desktop\\team_project\\usstock\\scrap_cert.pem",
                     )

        db = client['project_data']
        collection = db['temp']
        data = {"username":username,"email":user_email,"verification_code":verification_code,"status":"unverified"}
        result = collection.insert_one(data)
        

