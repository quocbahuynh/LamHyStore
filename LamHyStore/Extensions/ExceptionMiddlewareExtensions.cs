using System.Net;
using LamHyStore.Contracts;
using LamHyStore.Entities.ErrorModel;
using LamHyStore.Entities.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace LamHyStore.Extensions
{

    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureExceptionHandler(this WebApplication app,
           ILoggerManager logger)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.ContentType = "application/json";
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();

                    if (contextFeature != null)
                    {
                        // Determine the status code based on the exception type
                        context.Response.StatusCode = contextFeature.Error switch
                        {
                            NotFoundException => StatusCodes.Status404NotFound,
                            DuplicateEntityException => StatusCodes.Status409Conflict, // Handle duplication as conflict
                            _ => StatusCodes.Status500InternalServerError
                        };

                        // Log the error details
                        logger.LogError($"Something went wrong: {contextFeature.Error}");

                        // Return the error response in JSON format
                        await context.Response.WriteAsync(new ErrorDetails()
                        {
                            StatusCode = context.Response.StatusCode,
                            Message = contextFeature.Error.Message,
                        }.ToString());
                    }
                });
            });
        }
    }


}
