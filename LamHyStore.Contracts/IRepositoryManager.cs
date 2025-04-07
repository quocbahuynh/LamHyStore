using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Contracts
{
    public interface IRepositoryManager
    {   
        ILiveStreamRepository LiveStream { get; }

        ILiveStreamCartRepository LiveStreamCart { get; }

        void Save();
    }
}
