namespace LamHyStore.Shared.DataTransferObjects.Menu
{
    public class MenuDto
    {
        public Guid Id { get; set; }
        public string IconUrl { get; set; }
        public string Title { get; set; }
        public int Position { get; set; }
        public string PageType { get; set; } // Include PageType Name
        public List<SubMenuDto> Sections { get; set; } // Prevent infinite loop
    }

    public class SubMenuDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public IList<string>? ProductExternalIds { get; set; }
    }

    public class PageHeroBannerCreation {

        public string PageType { get; set; }
        public string Title { get; set; }
    }


    public class HeroBannerDtoV2
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string PageType { get; set; } // Include PageType Name
        public List<PhotoBannerDto> Sections { get; set; } // Prevent infinite loop
    }


    public class PhotoBannerDto
    {
        public Guid Id { get; set; }
        public string Link { get; set; }
        public string ThumnailUrl { get; set; }

    }

    public class SectionListDtoV2
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string PageType { get; set; } // Include PageType Name
        public List<SubSectionDto> Sections { get; set; } // Prevent infinite loop
    }

    public class SubSectionDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string? Description { get; set; }
        public IList<string>? ProductExternalIds { get; set; }
    }

    public class BestSellerDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public int Position { get; set; }
        public string PageType { get; set; } // Include PageType Name
        public List<SubBestSellerItemDto> Sections { get; set; } // Prevent infinite loop
    }

    public class SubBestSellerItemDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }

        public string ThumnailUrl { get; set; }
        public IList<string>? ProductExternalIds { get; set; }
    }

    public class PageCreationAndUpdateDto
    {
        public string PageType { get; set; }
        public string IconUrl { get; set; }
        public string Title { get; set; }
    }

    public class PageTypePayload
    {
        public string PageType { get; set; }
    }

    public class PageTypePayloadForSection
    {
        public string MenuId { get; set; }
        public string PageType { get; set; }
    }

    public class MenuPositionDto
    {
        public Guid Id { get; set; }
        public int Position { get; set; }
    }


    public class PhotoBannerCreationDto{
        public string ThumnailUrl { get; set; }
        public string Link { get; set; }
    }

    public class SectionCreationDto
    {

        public string PageType { get; set; }

        public string ThumnailUrl { get; set; }

        public Guid PageId { get; set; }

        public string Title { get; set; }

        public IList<string>? ProductExternalIds { get; set; }
    }



    public class SectionSaleCreationDto
    {

        public string Description { get; set; }

        public string Title { get; set; }

        public IList<string>? ProductExternalIds { get; set; }
    }


    public class BestSellerCreationDto
    {

        public string ThumnailUrl { get; set; }

        public string Title { get; set; }

        public IList<string>? ProductExternalIds { get; set; }
    }

    public class BestSellerUpdateDto
    {

        public string ThumnailUrl { get; set; }

        public string Title { get; set; }

        public IList<string>? ProductExternalIds { get; set; }
    }

    public class MenuItemUpdateDto
    {

        public string Title { get; set; }

        public string Description { get; set; }

        public IList<string>? ProductExternalIds { get; set; }
    }

    public class SectionPositionDto
    {
        public Guid Id { get; set; }
        public int Position { get; set; }
    }



}
