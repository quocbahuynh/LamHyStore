namespace LamHyStore.Entities.Models
{
    public class OtpRecord
    {
        public Guid Id { get; set; }

        public string UserId { get; set; }

        public string Otp { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
