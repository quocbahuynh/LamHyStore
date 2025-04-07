using System.Security.Claims;
using AutoMapper;
using LamHyStore.Contracts;
using LamHyStore.Entities.Exceptions;
using LamHyStore.Entities.Models;
using LamHyStore.Contracts;
using LamHyStore.Shared.RequestModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using LamHyStore.Shared.DataTransferObjects;
using LamHyStore.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Repositorys;
using LamHyStore.Service.Contracts;


namespace LamHyStore.Presentation.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IRepositoryManager _repo;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly IKioVietAPI _kioVietApi;
        private IAuthenticationService _authenticationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly RepositoryContext _repositoryContext;
        private IEmailService _emailService;
        private User _user;


        public AuthenticationController(
         IRepositoryManager repo,
         UserManager<User> userManager,
         IConfiguration configuration,
         ILoggerManager logger,
         IMapper mapper,
         IAuthenticationService authenticationService,
         IKioVietAPI kioVietApi,
         IHttpContextAccessor httpContextAccessor,
          RepositoryContext repositoryContext,
          IEmailService emailService
         )
        {
            _repo = repo;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _mapper = mapper;
            _kioVietApi = kioVietApi;
            _authenticationService = authenticationService;
            _httpContextAccessor = httpContextAccessor;
            _repositoryContext = repositoryContext;
            _emailService = emailService;

        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDto userForRegistration)
        {
            var existingUserKiotViet = await _kioVietApi.FindCustomerByPhoneNumberAsync(userForRegistration.PhoneNumber);
            var existingUserDatabase = await _userManager.Users.Where(u => u.PhoneNumber == userForRegistration.PhoneNumber).FirstOrDefaultAsync();

            var user = _mapper.Map<User>(userForRegistration);

            var createdkioVietCustomerPayLoad = new CreateCustomerPayload
            {
                Name = userForRegistration.FullName,
                ContactNumber = userForRegistration.PhoneNumber,
                Email = userForRegistration.Email,
                Comments = "Từ website",
                BranchId = 44544,
                GroupIds = new List<int> { 220195 }
            };

            if (existingUserKiotViet == null && existingUserDatabase == null)
            {

                var result = await _userManager.CreateAsync(user, userForRegistration.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRolesAsync(user, userForRegistration.Roles);

                    var createdKioVietCustomer = await _kioVietApi.CreatedCustomerByAsync(createdkioVietCustomerPayLoad);

                    // Check if customer creation in KiotViet was successful
                    if (createdKioVietCustomer != null)
                    {
                        // Update the user with the external KiotViet customer ID
                        user.CustomerExternalID = createdKioVietCustomer.Id.ToString();

                        // Save the updated user to the local database
                        await _userManager.UpdateAsync(user);
                    }
                    return StatusCode(201);
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.TryAddModelError(error.Code, error.Description);
                    }
                    return BadRequest(ModelState);
                }
            }
            else if (existingUserKiotViet != null && existingUserDatabase == null)
            {
                user.PhoneNumber = existingUserKiotViet.ContactNumber;
                user.FullName = existingUserKiotViet.Name;
                user.CustomerExternalID = existingUserKiotViet.Id.ToString();

                var result = await _userManager.CreateAsync(user, userForRegistration.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRolesAsync(user, userForRegistration.Roles);
                    return StatusCode(201);
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.TryAddModelError(error.Code, error.Description);
                    }
                    return BadRequest(ModelState);
                }
            }
            else
            {
                throw new DuplicateEntityException($"A user with phone number {userForRegistration.PhoneNumber} already exists.");
            }

            // Default return in case no condition was met.
            return StatusCode(500, "An unexpected error occurred.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDto user)
        {
            // Validate user credentials (phone number and password)
            if (!await _authenticationService.ValidateUser(user))
                return Unauthorized();

            // Retrieve the user by phone number
            var _user = await _userManager.Users
                                           .Where(u => u.PhoneNumber == user.PhoneNumber)
                                           .FirstOrDefaultAsync();

            // Check if the user exists and has the "User" role
            if (_user == null ||
                !await _userManager.IsInRoleAsync(_user, "USER"))
            {
                return Unauthorized();
            }

            // If the user is valid and has the "User" role, create and return the token
            var token = await _authenticationService.CreateToken();
            return Ok(new { AccessToken = token });
        }


        [HttpPost("loginForStaffOrAdmin")]
        public async Task<IActionResult> AuthenticateForStaffOrAdmin([FromBody] UserForAuthenticationDto user)
        {
            // Validate user credentials
            if (!await _authenticationService.ValidateUser(user))
                return Unauthorized();

            // Retrieve user by phone number
            var _user = await _userManager.Users
                                           .Where(u => u.PhoneNumber == user.PhoneNumber)
                                           .FirstOrDefaultAsync();

            // Check if the user has the "Staff" or "Admin" role
            if (_user == null || !await _userManager.IsInRoleAsync(_user, "STAFF") && !await _userManager.IsInRoleAsync(_user, "ADMINISTRATOR"))
            {
                return Unauthorized();
            }

            // If valid, create and return the token
            var token = await _authenticationService.CreateToken();
            return Ok(new { AccessToken = token });
        }

        [AllowAnonymous]
        [HttpGet("staff-admin")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            // Retrieve all users
            var users = _userManager.Users.ToList();

            var result = new List<object>();

            // Iterate over users to get their roles
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                // Check if the user has either "Staff" or "Admin" role
                if (roles.Contains("Staff") || roles.Contains("Admin"))
                {
                    result.Add(new
                    {
                        user.Id,
                        user.FullName,
                        user.Email,
                        user.PhoneNumber,
                        Roles = roles
                    });
                }
            }

            // If no users found with these roles
            if (result.Count == 0)
            {
                return NotFound("No users found with 'Staff' or 'Admin' roles.");
            }

            // Return the list of users with "Staff" or "Admin" roles
            return Ok(result);
        }

        [HttpPost("check-account")]
        public async Task<IActionResult> CheckAccount([FromBody] CheckAccountDto checkAccount)
        {
            var existingUser = await _userManager.Users
                .Where(u => u.PhoneNumber == checkAccount.PhoneNumber || u.Email == checkAccount.Email)
                .FirstOrDefaultAsync();

            if (existingUser == null)
            {
                return NotFound("User not found.");
            }

            // Generate OTP
            var otp = _authenticationService.GenerateOtp();

            // Save OTP in database with expiration time
            var otpRecord = new OtpRecord
            {
                UserId = existingUser.Id,
                Otp = otp,
                ExpiryDate = DateTime.UtcNow.AddMinutes(10) // OTP valid for 10 minutes
            };

            await _repositoryContext.OtpRecords.AddAsync(otpRecord);
            await _repositoryContext.SaveChangesAsync();

            // Send OTP to email
            await _emailService.SendOtpEmail(existingUser.Email, otp);
            

            return Ok();
        }

        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] ResetPasswordDto resetPassword)
        {
            var existingUser = await _userManager.Users
                .Where(u => u.PhoneNumber == resetPassword.PhoneNumber || u.Email == resetPassword.Email)
                .FirstOrDefaultAsync();

            if (existingUser == null)
            {
                return NotFound("User not found");
            }

            var otpRecord = await _repositoryContext.OtpRecords
                    .Where(o => o.UserId == existingUser.Id)
                    .OrderByDescending(o => o.ExpiryDate) // Use the latest OTP
                    .FirstOrDefaultAsync();

            if (otpRecord == null)
            {
                return BadRequest("No OTP found for this user.");
            }

            // Validate the OTP and its expiration time
            if (otpRecord.Otp != resetPassword.Otp || otpRecord.ExpiryDate < DateTime.UtcNow)
            {
                return BadRequest("Invalid OTP or OTP has expired.");
            }
            // Check if the OTP matches and is still valid
            var token = await _userManager.GeneratePasswordResetTokenAsync(existingUser);
            var result = await _userManager.ResetPasswordAsync(existingUser, token, resetPassword.NewPassword);

            if (result.Succeeded)
            {

                return Ok();
            }

            return BadRequest("Failed to update password.");
        }


        [AllowAnonymous]
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> CustomerProfile() {

            var user = _httpContextAccessor.HttpContext?.User;
            var userKiotVietId = user?.FindFirst(ClaimTypes.Name)?.Value;
            var existingUserKiotViet = await _kioVietApi.GetCustomerProfileByKiotVietIDAsync(userKiotVietId);

            return Ok(existingUserKiotViet);
        }


        [AllowAnonymous]
        [HttpGet("order-history")]
        [Authorize]
        public async Task<IActionResult> CustomerOrderHistory(int pageSize = 10, int currentItem = 1)
        {

            var user = _httpContextAccessor.HttpContext?.User;
            var userKiotVietId = user?.FindFirst(ClaimTypes.Name)?.Value;
            var ordersHistoryUserKiotViet = await _kioVietApi.GetCustomerOrderHistoryByKiotVietIDAsync(userKiotVietId, pageSize, currentItem);

            return Ok(ordersHistoryUserKiotViet);
        }




        [AllowAnonymous]
        [HttpGet("test")]
        public async Task<IActionResult> GetToken()
        {
            try
            {
                var createdkioVietCustomerPayLoad = new CreateCustomerPayload
                {
                    Name = "Huỳnh Bá Quốc",
                    ContactNumber = "0357280618",
                    Email = "quochbcontact@gmail.com",
                    Comments = "Từ website",
                    BranchId = 44544,
                    GroupIds = new List<int> { 220195 }
                };


                var token = await _kioVietApi.CreatedCustomerByAsync(createdkioVietCustomerPayLoad);
                
                return Ok(token);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("delete-staff/{id}")]
        public async Task<IActionResult> DeleteStaffById(Guid id)
        {
            // Retrieve the user by ID
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound($"No user found with ID: {id}");
            }

            // Check if the user has the "Staff" role
            var isStaff = await _userManager.IsInRoleAsync(user, "Staff");
            if (!isStaff)
            {
                return BadRequest("The specified user does not have the 'Staff' role.");
            }

            // Delete the user
            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                _logger.LogInfo($"Staff with ID {id} has been successfully deleted.");
                return NoContent();
            }

            // Handle potential errors
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return BadRequest(ModelState);
        }


    }
}
