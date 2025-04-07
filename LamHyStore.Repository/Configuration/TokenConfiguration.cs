using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LamHyStore.Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LamHyStore.Repository.Configuration
{
    public class TokenConfiguration : IEntityTypeConfiguration<Token>
    {
        public void Configure(EntityTypeBuilder<Token> builder)
        {
            builder.HasData(
                 new Token
                 {
                     Id = Guid.NewGuid(),
                     AccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE3MzMzMDY2MDAsImV4cCI6MTczMzM5MzAwMCwiaXNzIjoiaHR0cDovL2lkLmtpb3R2aWV0LnZuIiwiY2xpZW50X2lkIjoiOGQ0ZjEwMmUtZGUyMC00NGFlLTk3MjAtMzdiYzlkZTA2MjRlIiwiY2xpZW50X1JldGFpbGVyQ29kZSI6InF1b2NodXluaG15cGhhbSIsImNsaWVudF9SZXRhaWxlcklkIjoiNTAwNjU3Mzk4IiwiY2xpZW50X1VzZXJJZCI6IjMxODEzNCIsImNsaWVudF9TZW5zaXRpdmVBcGkiOiJUcnVlIiwiY2xpZW50X0dyb3VwSWQiOiIxOCIsImlhdCI6MTczMzMwNjYwMCwic2NvcGUiOlsiUHVibGljQXBpLkFjY2VzcyJdfQ.T-424qjFQrIOjDHMnKqP8-Uqka5dNr7xCY-OoOdbsbhht3WFWvc9OkIIpWqwd1Bo1coZALtXJaOJxvEwOxh-gxx8h9CgTIxuvRjLgFbz_E6BI7jxPgXcLBLLb1rLz31cISY7jiZr4pJrMME4FIFLn8PLg7DpgWdL5wCoYy6n5PTxNUwz3IyDeZ3cI9XLXBOECopBBv0fv-z4_ATsQQ3L_8-QhoKDxSim488mPlGy_H4GNYd6uHj8YwbXGnLZg3OOwCXboYkun7P2owb0Egq8pSMwzRfUEmIGY0MLRPduF4nHAptFXm__NaoJIY-ACUV-Cr4gIdeGQzK6sfoAT9tmPg"

                 }
            );
        }
    }
}
