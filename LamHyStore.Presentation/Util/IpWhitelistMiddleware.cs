using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using LamHyStore.Contracts;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace LamHyStore.Presentation.Util
{
    public class IPWhitelistFilter : ActionFilterAttribute
    {
        private readonly List<IPAddress> _whitelistedIPs;
        private readonly ILoggerManager _logger;
        public IPWhitelistFilter(ILoggerManager logger, List<IPAddress> whitelistedIPs)
        {
            _logger = logger;
            _whitelistedIPs = whitelistedIPs;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {

            var remoteIp = context.HttpContext.Connection.RemoteIpAddress;

            if (remoteIp.IsIPv4MappedToIPv6)
            {
                remoteIp = remoteIp.MapToIPv4();
            }
            _logger.LogInfo("Remote IpAddress: " + remoteIp);


            var badIp = true;
            foreach (var testIp in _whitelistedIPs)
            {
                if (testIp.Equals(remoteIp))
                {
                    badIp = false;
                    break;
                }
            }

            if (badIp)
            {
                _logger.LogWarn(
                    "Forbidden Request from Remote IP address: " + remoteIp);
                context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
                return;
            }

            base.OnActionExecuting(context);
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Do nothing after the action executes.
        }
    }
}
