using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp; // Required for SmtpClient
using MailKit.Security;
using LamHyStore.Service.Contracts; // Ensure this is where IEmailService is defined

namespace LamHyStore.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOtpEmail(string email, string otp)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("LamHy.Store", _configuration["Smtp:FromEmail"]));
            message.To.Add(new MailboxAddress("ABC", email));
            message.Subject = "LamHy.Store gửi mã đăng nhập";

            var body = new TextPart("plain")
            {
                Text = $"Mã đăng nhập của bạn là: {otp}"
            };

            message.Body = body;

            try
            {
                using (var smtpClient = new SmtpClient())
                {
                    // Connect to SMTP server
                    await smtpClient.ConnectAsync(_configuration["Smtp:Host"], int.Parse(_configuration["Smtp:Port"]), MailKit.Security.SecureSocketOptions.StartTls);

                    // Authenticate if necessary
                    await smtpClient.AuthenticateAsync(_configuration["Smtp:Username"], _configuration["Smtp:Password"]);

                    // Send the email
                    await smtpClient.SendAsync(message);

                    // Disconnect
                    await smtpClient.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error sending OTP email", ex);
            }
        }
    }
}
