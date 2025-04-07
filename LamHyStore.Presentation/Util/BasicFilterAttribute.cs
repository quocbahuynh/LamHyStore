using LamHyStore.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LamHyStore.Presentation.Util
{
    public class BasicFilterAttribute : ActionFilterAttribute
    {
        private readonly ILoggerManager _logger;
        private static readonly HashSet<string> WhitelistedIps = new HashSet<string>
        {
            "113.52.45.78",
            "116.97.245.130",
            "42.118.107.252",
            "113.20.97.250",
            "203.171.19.146",
            "103.220.87.4",
            "103.220.86.4",
            "103.220.86.10",
            "103.220.87.10"
        };



        // Injecting ILoggerManager into the constructor
        public BasicFilterAttribute(ILoggerManager logger)
        {
            _logger = logger;
        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {

            // Get the client IP address
            var ipAddress = context.HttpContext.Connection.RemoteIpAddress?.ToString();

            // Example: Log the IP address
            Console.WriteLine($"Client IP Address: {ipAddress} x");
            _logger.LogInfo($"Client IP Address: {ipAddress} x");

            if (string.IsNullOrEmpty(ipAddress) || !WhitelistedIps.Contains(ipAddress))
            {
                Console.WriteLine($"Unauthorized access attempt from IP: {ipAddress}");
                _logger.LogWarn($"Unauthorized access attempt from IP: {ipAddress}");
                context.Result = new ForbidResult(); // Denies access
                return;
            }

            Console.WriteLine($"Authorized access attempt from IP: {ipAddress}");
            _logger.LogInfo($"Authorized access attempt from IP: {ipAddress}");

            base.OnActionExecuting(context);
        }
    }
}
