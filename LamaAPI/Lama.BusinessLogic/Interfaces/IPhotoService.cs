﻿using Lama.Domain.BlobModels;
using Lama.Domain.DataTransferObjects.Photo;
using Lama.Domain.DbModels;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IPhotoService 
    {
        Task CreateAll(PhotoReceived[] photos);
        Task<Photo> CreateAvatar(PhotoReceived item);
        Task<IEnumerable<PhotoDocument>> GetAll();
        Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO);
        Task<PhotoDocument> Get(int id);
        Task MarkPhotoAsDeleted(int photosToDeleteId);
        Task<DeletedPhotoDTO[]> GetDeletedPhotos();
        Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete);
        Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore);
    }
}
