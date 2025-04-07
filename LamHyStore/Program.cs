using LamHyStore.Contracts;
using LamHyStore.KioVietService;
using LamHyStore.GoogleSheetService;
using LamHyStore.VNpayService;
using LamHyStore.EmailService;
using LamHyStore.Presentation.Util;
using LamHyStore.Extensions;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Options;
using NLog;
using LamHyStore.Repository;
using LamHyStore.Service;
using LamHyStore.Service.Contracts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

    // If your proxy is not adding these headers, set `KnownNetworks` and `KnownProxies` to empty
    options.KnownNetworks.Clear(); // Allow requests from any network
    options.KnownProxies.Clear();  // Allow requests from any proxy
});
// Add services to the container.
builder.Services.ConfigureCors();
//builder.Services.ConfigureIISIntegration();
builder.Services.ConfigureLoggerService();
builder.Services.AddAuthentication();
builder.Services.ConfigureIdentity();
builder.Services.AddScoped<BasicFilterAttribute>();
builder.Services.AddScoped<ILiveStreamRepository, LiveStreamRepository>();
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureSqlContext(builder.Configuration);
builder.Services.AddHttpClient<IKioVietAPI, KioVietAPI>();
builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ILiveStreamService, LiveStreamService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IVNpayService, VNpayService>();
builder.Services.AddScoped<IGoogleSheetsService, GoogleSheetsService>();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
NewtonsoftJsonPatchInputFormatter GetJsonPatchInputFormatter() =>
new ServiceCollection().AddLogging().AddMvc().AddNewtonsoftJson()
.Services.BuildServiceProvider()
.GetRequiredService<IOptions<MvcOptions>>().Value.InputFormatters
.OfType<NewtonsoftJsonPatchInputFormatter>().First();



builder.Services.AddControllers(options =>
{
    options.RespectBrowserAcceptHeader = true;   // Respect the Accept header from the browser
    options.ReturnHttpNotAcceptable = true;      // Return 406 Not Acceptable when Accept header is not met
    options.InputFormatters.Insert(0, GetJsonPatchInputFormatter()); // Insert JsonPatch input formatter
})
.AddApplicationPart(typeof(LamHyStore.Presentation.AssemblyReference).Assembly);



builder.Services.AddAutoMapper(typeof(Program));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();
var logger = app.Services.GetRequiredService<ILoggerManager>();
app.ConfigureExceptionHandler(logger);

if (app.Environment.IsProduction())
    app.UseHsts();




// Configure the HTTP request pipeline.
// Enable Swagger UI in all environments
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "LamHyStore API V1");
    c.RoutePrefix = ""; // Serve Swagger at the root URL
});


app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.UseForwardedHeaders();
app.MapControllers();

app.Run();
