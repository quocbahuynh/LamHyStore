using LamHyStore.Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LamHyStore.Repository.Configuration
{
    public class PageTypeConfiguration : IEntityTypeConfiguration<PageType>
    {
        public void Configure(EntityTypeBuilder<PageType> builder)
        {
            builder.HasData(
                 new PageType
                 {
                     Id = Guid.NewGuid(),
                     Name= "MENU_HOME"
                 },
                 new PageType
                 {
                     Id = Guid.NewGuid(),
                     Name = "SECTION_HOME"
                 },
                 new PageType
                 {
                     Id = Guid.NewGuid(),
                     Name = "BANNER_HOME"
                 },
                 new PageType
                 {
                     Id = Guid.NewGuid(),
                     Name = "BESTSELLER_HOME"
                 },
                 new PageType
                 {
                     Id = Guid.NewGuid(),
                     Name = "GOMORDER"
                 },
                 new PageType
                 {
                     Id = Guid.NewGuid(),
                     Name = "LIVESTREAM"
                 }
            );
        }
    }
}
