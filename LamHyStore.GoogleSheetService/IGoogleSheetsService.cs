using LamHyStore.Shared.DataTransferObjects;

namespace LamHyStore.GoogleSheetService
{
    public interface IGoogleSheetsService
    {
        bool TestConnection();
        bool CreateSheet(string sheetName, string bulkOrderSlug);
        bool DeleteSheet(string bulkOrderSlug);
        bool AddOrderByKeyword(string keyword, BulkOrderSheetOrder order);
    }
}
