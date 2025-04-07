using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using LamHyStore.Shared.DataTransferObjects;
using Microsoft.Extensions.Configuration;

namespace LamHyStore.GoogleSheetService
{
    public class GoogleSheetsService : IGoogleSheetsService
    {
        private readonly string SpreadsheetId;
        private readonly SheetsService _service;

        public GoogleSheetsService(IConfiguration configuration)
        {
            SpreadsheetId = configuration["GoogleSheets:SpreadsheetId"] ?? throw new ArgumentNullException("GoogleSheets:SpreadsheetId");
            
            var credsSection = configuration.GetSection("GoogleSheets:Credentials");
            if (!credsSection.Exists()) throw new ArgumentNullException("GoogleSheets:Credentials missing from configuration.");
            
            var credsDict = credsSection.GetChildren().ToDictionary(x => x.Key, x => x.Value);
            // Replace literal \n with actual newline for the private_key
            if (credsDict.ContainsKey("private_key") && credsDict["private_key"] != null)
            {
                credsDict["private_key"] = credsDict["private_key"].Replace("\\n", "\n");
            }
            
            var jsonString = System.Text.Json.JsonSerializer.Serialize(credsDict);
            
            GoogleCredential credential = GoogleCredential.FromJson(jsonString)
                .CreateScoped(SheetsService.Scope.Spreadsheets);

            _service = new SheetsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Lamhy.Store Google Sheet",
            });
        }

        public bool TestConnection()
        {
            try
            {
                var request = _service.Spreadsheets.Get(SpreadsheetId);
                var response = request.Execute();
                return response != null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error connecting to Google Sheets: {ex.Message}");
                return false;
            }
        }

        public bool CreateSheet(string sheetName, string bulkOrderSlug)
        {
            try
            {
                var addSheetRequest = new AddSheetRequest { Properties = new SheetProperties { Title = sheetName } };
                var batchUpdateSpreadsheetRequest = new BatchUpdateSpreadsheetRequest
                {
                    Requests = new List<Request> { new Request { AddSheet = addSheetRequest } }
                };

                _service.Spreadsheets.BatchUpdate(batchUpdateSpreadsheetRequest, SpreadsheetId).Execute();

                // Step 2: Add Link in the First Row
                var linkValue = new List<object> { $"https://lamhystore/g/{bulkOrderSlug}" };
                var linkRange = new ValueRange { Values = new List<IList<object>> { linkValue } };
                var linkUpdate = _service.Spreadsheets.Values.Update(linkRange, SpreadsheetId, $"{sheetName}!A1");
                linkUpdate.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.RAW;
                linkUpdate.Execute();
                var mergeCellsRequest = new Request
                {
                    MergeCells = new MergeCellsRequest
                    {
                        Range = new GridRange
                        {
                            SheetId = GetSheetIdByName(sheetName),
                            StartRowIndex = 0,
                            EndRowIndex = 1,
                            StartColumnIndex = 0,
                            EndColumnIndex = 5
                        },
                        MergeType = "MERGE_ALL"
                    }
                };
                var headerValues = new List<object>
                {
                    "Khách hàng", "DS sản phẩm", "PT thanh toán", "PT nhận hàng", "Địa chỉ nhận hàng"
                };

                var headerRange = new ValueRange
                {
                    Values = new List<IList<object>> { headerValues }
                };

                var updateRequest = _service.Spreadsheets.Values.Update(headerRange, SpreadsheetId, $"{sheetName}!A2:E2");
                updateRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.RAW;
                updateRequest.Execute();

                // ✅ Step 4: Adjust Column Widths
                var columnWidths = new List<Request>
                {
                    SetColumnWidth(sheetName, 0, 200),  // A: Khách hàng
                    SetColumnWidth(sheetName, 1, 650),  // B: DS sản phẩm
                    SetColumnWidth(sheetName, 2, 200),  // C: PT thanh toán
                    SetColumnWidth(sheetName, 3, 200),  // D: PT nhận hàng
                    SetColumnWidth(sheetName, 4, 300)   // E: Địa chỉ nhận hàng
                };

                var batchUpdateRequest = new BatchUpdateSpreadsheetRequest
                {
                    Requests = columnWidths.Concat(new List<Request> { mergeCellsRequest }).ToList()
                };

                _service.Spreadsheets.BatchUpdate(batchUpdateRequest, SpreadsheetId).Execute();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating sheet: {ex.Message}");
                return false;
            }
        }

        // ✅ Helper Method to Set Column Width
        private Request SetColumnWidth(string sheetName, int columnIndex, int width)
        {
            return new Request
            {
                UpdateDimensionProperties = new UpdateDimensionPropertiesRequest
                {
                    Range = new DimensionRange
                    {
                        SheetId = GetSheetIdByName(sheetName),
                        Dimension = "COLUMNS",
                        StartIndex = columnIndex,
                        EndIndex = columnIndex + 1
                    },
                    Properties = new DimensionProperties
                    {
                        PixelSize = width
                    },
                    Fields = "pixelSize"
                }
            };
        }

        private int GetSheetIdByName(string sheetName)
        {
            var spreadsheet = _service.Spreadsheets.Get(SpreadsheetId).Execute();
            foreach (var sheet in spreadsheet.Sheets)
            {
                if (sheet.Properties.Title == sheetName)
                    return (int)sheet.Properties.SheetId;
            }
            throw new Exception($"Sheet '{sheetName}' not found.");
        }

        public bool DeleteSheet(string bulkOrderSlug)
        {
            try
            {
                var spreadsheet = _service.Spreadsheets.Get(SpreadsheetId).Execute();
                foreach (var sheet in spreadsheet.Sheets)
                {
                    if (sheet.Properties.Title.Contains(bulkOrderSlug))
                    {
                        var deleteRequest = new Request
                        {
                            DeleteSheet = new DeleteSheetRequest
                            {
                                SheetId = (int)sheet.Properties.SheetId
                            }
                        };

                        var batchUpdateRequest = new BatchUpdateSpreadsheetRequest
                        {
                            Requests = new List<Request> { deleteRequest }
                        };

                        _service.Spreadsheets.BatchUpdate(batchUpdateRequest, SpreadsheetId).Execute();
                        return true;
                    }
                }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting sheet: {ex.Message}");
                return false;
            }
        }

        private string FindSheetByKeyword(string keyword)
        {
            var spreadsheet = _service.Spreadsheets.Get(SpreadsheetId).Execute();
            foreach (var sheet in spreadsheet.Sheets)
            {
                if (sheet.Properties.Title.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                {
                    return sheet.Properties.Title;
                }
            }
            throw new Exception($"No sheet found containing keyword '{keyword}'.");
        }

        public bool AddOrderByKeyword(string keyword, BulkOrderSheetOrder order)
        {
            try
            {
                string sheetName = FindSheetByKeyword(keyword);

                var rowValues = new List<object>
        {
            $"{order.Name}\n{order.PhoneNumber}", // Customer info
            order.Products,                       // Formatted products string
            order.PaymentMethod,                  // Payment method
            order.DeliveryMethod,                 // Delivery method
            order.DeliveryAddress                 // Delivery address
        };

                // Determine the next available row
                var range = $"{sheetName}!A:E";
                var request = _service.Spreadsheets.Values.Get(SpreadsheetId, range);
                var response = request.Execute();
                int nextRow = response.Values != null ? response.Values.Count + 1 : 3; // Start at row 3

                // Append the row
                var valueRange = new ValueRange { Values = new List<IList<object>> { rowValues } };
                var updateRequest = _service.Spreadsheets.Values.Update(valueRange, SpreadsheetId, $"{sheetName}!A{nextRow}:E{nextRow}");
                updateRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.RAW;
                updateRequest.Execute();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding order: {ex.Message}");
                return false;
            }
        }
    }
}
