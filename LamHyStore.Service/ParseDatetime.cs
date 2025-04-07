using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Service
{
    public class ParseDatetime
    {
        public static DateTime TimeNow()
        {
            TimeZoneInfo serverTimeZone = TimeZoneInfo.Local;

            // Chuyển đổi thời gian UTC thành thời gian địa phương của máy chủ
            DateTime localDateTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, serverTimeZone);
            return localDateTime;
        }
    }
}
