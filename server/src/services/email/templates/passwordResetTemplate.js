const passwordResetTemplate = ({ resetLink }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2f2c57;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 14px 28px;
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      background-color: #024CEE;
      text-decoration: none;
      border-radius: 8px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>You requested to reset your password.</p>
    <p>Click the button below to reset your password:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p style="margin-top: 20px; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="font-size: 13px; word-break: break-all;"><a href="${resetLink}">${resetLink}</a></p>
    <div class="footer">
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;

export default passwordResetTemplate;