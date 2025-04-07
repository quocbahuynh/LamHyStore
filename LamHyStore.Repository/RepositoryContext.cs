using LamHyStore.Entities.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using LamHyStore.Repository.Configuration;

namespace Repositorys
{
    public class RepositoryContext : IdentityDbContext<User>
    {
        public RepositoryContext(DbContextOptions options) : base(options)
        {
            
            try
            {
                var databaseCreater = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (databaseCreater != null)
                {
                    if (!databaseCreater.CanConnect())
                    {
                        databaseCreater.Create();
                    }
                    if (!databaseCreater.HasTables())
                    {
                        databaseCreater.CreateTables();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Page>()
               .HasMany(p => p.Sections) // One-to-Many
               .WithOne(s => s.Page) // Each Section belongs to one Page
               .HasForeignKey(s => s.PageId) // Foreign Key in Section
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.ApplyConfiguration(new PageTypeConfiguration());
            modelBuilder.ApplyConfiguration(new RoleConfiguration());
        }
        public DbSet<PageType>? PageTypes { get; set; }

        public DbSet<Page>? Pages { get; set; }

        public DbSet<Section>? Sections { get; set; }   
        
        public DbSet<Order>? Orders { get; set; }
        public DbSet<LiveStream>? LiveStreams { get; set; }
        public DbSet<LiveStreamCart>? LiveStreamCarts { get; set; }

        public DbSet<Token>? Tokens { get; set; }

        public DbSet<OtpRecord>? OtpRecords { get; set; }

        public DbSet<GomOrder>? GomOrders { get; set; }
    }
}
