using AutoMapper;
using LamHyStore.Entities.Models;
using LamHyStore.Shared.DataTransferObjects;
using LamHyStore.Shared.DataTransferObjects.Menu;
namespace LamHyStore
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserForRegistrationDto, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));

            // LiveStream mappings
            CreateMap<LiveStreamCart, LiveStreamCartItemDto>().ReverseMap();
            CreateMap<LiveStreamForUpdateDto, LiveStream>().ReverseMap();
            CreateMap<LiveStreamCartItemForCreationDto, LiveStreamCart>().ReverseMap();
            CreateMap<LiveStream, LiveStreamDto>()
                .ForMember(dest => dest.LiveStreamCarts, opt => opt.MapFrom(src => src.liveStreamCarts));
            CreateMap<UpdateLiveStreamDto, LiveStream>()
              .ForMember(dest => dest.liveStreamCarts,
                  opt => opt.Ignore());

            //GomOrder
            CreateMap<BulkOrderForCreationDto, GomOrder>()
                .ForMember(dest => dest.productExternalIds, opt => opt.MapFrom(src => src.ProductExternalIds));
            CreateMap<BulkOrderForUpdateDto, GomOrder>()
               .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
               .ForMember(dest => dest.productExternalIds, opt => opt.Ignore());

            //Menu Response
            CreateMap<Page, MenuDto>()
            .ForMember(dest => dest.PageType, opt => opt.MapFrom(src => src.PageType.Name)) // Convert PageType entity to string
            .ForMember(dest => dest.Sections, opt => opt.MapFrom(src => src.Sections)); // Include Sections

            CreateMap<Section, SubMenuDto>();


            //BestSeller Response
            CreateMap<Page, BestSellerDto>()
              .ForMember(dest => dest.PageType, opt => opt.MapFrom(src => src.PageType.Name)) // Convert PageType entity to string
              .ForMember(dest => dest.Sections, opt => opt.MapFrom(src => src.Sections)); // Include Sections

             CreateMap<Section, SubBestSellerItemDto>();
            CreateMap<Section, BestSellerCreationDto>();
            CreateMap<BestSellerCreationDto, Section>();

            //HeroBanner 
            CreateMap<Page, HeroBannerDtoV2>()
              .ForMember(dest => dest.PageType, opt => opt.MapFrom(src => src.PageType.Name)) // Convert PageType entity to string
              .ForMember(dest => dest.Sections, opt => opt.MapFrom(src => src.Sections)); // Include Sections
            CreateMap<Section, PhotoBannerDto>();

            CreateMap<Section, PhotoBannerCreationDto>();
            CreateMap<PhotoBannerCreationDto, Section>();

            CreateMap<Page, PageHeroBannerCreation>()
            .ForMember(dest => dest.PageType, opt => opt.MapFrom(src => src.PageType.Name)); // Convert PageType entity to string

            CreateMap<PageHeroBannerCreation, Page>()
                .ForMember(dest => dest.PageType, opt => opt.Ignore()) // Ignore PageType navigation property
                .ForMember(dest => dest.PageTypeId, opt => opt.Ignore());

            // Section
            CreateMap<Page, SectionListDtoV2>()
             .ForMember(dest => dest.PageType, opt => opt.MapFrom(src => src.PageType.Name)) // Convert PageType entity to string
             .ForMember(dest => dest.Sections, opt => opt.MapFrom(src => src.Sections)); // Include Sections
            CreateMap<Section, SubSectionDto>();
            CreateMap<Section, SectionSaleCreationDto>();
            CreateMap<SectionSaleCreationDto, Section>();

            

            //Menu
            CreateMap<Page, PageCreationAndUpdateDto>()
            .ForMember(dest => dest.PageType, opt => opt.MapFrom(src => src.PageType.Name)); // Convert PageType entity to string

            CreateMap<PageCreationAndUpdateDto, Page>()
                .ForMember(dest => dest.PageType, opt => opt.Ignore()) // Ignore PageType navigation property
                .ForMember(dest => dest.PageTypeId, opt => opt.Ignore());
            CreateMap<Section, SectionCreationDto>()
               .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
               .ForMember(dest => dest.ProductExternalIds, opt => opt.Ignore()); ;
            CreateMap<SectionCreationDto, Section>()
                .ForMember(dest => dest.ProductExternalIds, opt => opt.MapFrom(src => src.ProductExternalIds));

        }
    }
}
