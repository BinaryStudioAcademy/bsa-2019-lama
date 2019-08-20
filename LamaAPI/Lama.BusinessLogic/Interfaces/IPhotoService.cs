﻿using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Photo;
using Lama.Domain.DbModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Lama.Domain.DTO.Reaction;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IPhotoService 
    {
        Task<IEnumerable<PhotoDocumentDTO>> FindPhoto(string criteria);
        Task<IEnumerable<UploadPhotoResultDTO>> CreateAll(CreatePhotoDTO[] photos);
        Task<Photo> CreateAvatar(CreatePhotoDTO item);
        Task<IEnumerable<PhotoDocumentDTO>> GetAll();
        Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO);
        Task<PhotoDocument> Get(int id);
        Task<string> GetPhoto(string blobId);
        Task MarkPhotoAsDeleted(int photosToDeleteId);
        Task<DeletedPhotoDTO[]> GetDeletedPhotos();
        Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete);
        Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore);
        Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotos(int id);
        Task<int> AddReaction(NewLikeDTO newLike);
        Task RemoveReaction(NewLikeDTO removeLike);
    }
}
