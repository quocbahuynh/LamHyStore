using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using LamHyStore.Repository;
using Repositorys;

namespace LamHyStore.ContextFactory
{
    public class RepositoryContextFactory : IDesignTimeDbContextFactory<RepositoryContext>
    {
        public RepositoryContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var builder = new DbContextOptionsBuilder<RepositoryContext>()
                .UseSqlServer(configuration.GetConnectionString("sqlConnection"), sqlOptions =>
                {
                    sqlOptions.MigrationsAssembly("LamHyStore");
                    sqlOptions.EnableRetryOnFailure();
                });

            return new RepositoryContext(builder.Options);
        }
    }

}
