using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;

using Microsoft.Extensions.Configuration;
using LamHyStore.Shared.DataTransferObjects;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace LamHyStore.Service
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IRepositoryManager _repo;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILoggerManager _logger;
        private readonly IKioVietAPI _kioVietApi;
        private User _user;


        public AuthenticationService(
         IRepositoryManager repo,
         UserManager<User> userManager,
         IConfiguration configuration,
         ILoggerManager logger,
         IKioVietAPI kioVietApi
         )
        {
            _repo = repo;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _kioVietApi = kioVietApi;

        }

     

        // Validate the user's credentials
        public async Task<bool> ValidateUser(UserForAuthenticationDto userForAuth)
        {
            _user = await _userManager.Users.Where(u => u.PhoneNumber == userForAuth.PhoneNumber).FirstOrDefaultAsync();

            var result = (_user != null && await _userManager.CheckPasswordAsync(_user, userForAuth.Password));
            if (!result)
            {
                _logger.LogWarn($"{nameof(ValidateUser)}: Authentication failed. Wrong phone number or password.");
            }
            return result;
        }

        // Create a JWT token for the user
        public async Task<string> CreateToken()
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims();
            var tokenOptions = GenerateTokenOptions(signingCredentials, claims);
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        // Get signing credentials for the token
        private SigningCredentials GetSigningCredentials()
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["secretKey"]);
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        // Get the claims for the user, including their roles
        private async Task<List<Claim>> GetClaims()
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, _user.PhoneNumber),
            new Claim(ClaimTypes.Name, _user.CustomerExternalID)
        };

            var roles = await _userManager.GetRolesAsync(_user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }

        // Generate token options (expiration, claims, etc.)
        private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");

            var tokenOptions = new JwtSecurityToken(
                issuer: jwtSettings["validIssuer"],
                audience: jwtSettings["validAudience"],
                claims: claims,
                expires: DateTime.Now.AddYears(1),
                signingCredentials: signingCredentials
            );

            return tokenOptions;
        }

        public string GenerateOtp()
        {
            Random random = new Random();
            return random.Next(1000, 9999).ToString();
        }
    }

}
