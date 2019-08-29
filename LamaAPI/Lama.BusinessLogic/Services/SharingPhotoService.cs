using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Lama.BusinessLogic.Exceptions;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;
using Lama.Domain.DTO.Photo;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Lama.BusinessLogic.Services
{


    public class SharingPhotoService: BaseService<Photo>, ISharingPhotoService
    {
        private readonly string _photoApiUrl;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        //TODO: move services declaration to startup and pass only url instead of configuration
        public SharingPhotoService(ApplicationDbContext context,IMapper mapper, IPhotoService photoService, string url)
            :base(context)
        {
            _photoApiUrl = url;
            _mapper = mapper;
            _photoService = photoService;
        }
        

        public async Task<SharedPhotoDTO> Get(int id)
        {
            var sharedPhotoData = await Context.SharedPhotos
                .Include(sharedPhoto => sharedPhoto.User)
                .ThenInclude(user => user.Photo)
                .Include(sharedPhoto => sharedPhoto.Photo)
                    .ThenInclude(photo => photo.Likes)
                .Include(sharedPhoto => sharedPhoto.Photo)
                    .ThenInclude(photo => photo.Comments)
                .FirstOrDefaultAsync(sharedPhoto => sharedPhoto.PhotoId == id);
            
            if (sharedPhotoData == null)
            {
                throw new NotFoundException(nameof(SharedPhoto), id);
            }
            var url = string.Empty;
            if (sharedPhotoData.User.Photo != null)
            {
                url = (await _photoService.Get(sharedPhotoData.User.Photo.Id)).Blob256Id;
            }
            var mappedResponse = _mapper.Map<SharedPhotoDTO>(sharedPhotoData);
            mappedResponse.User.PhotoUrl = url;

            return mappedResponse;
        }

        public async Task<PhotoDocument> UpdatePhotoDocumentWithSharedLink(int id, string sharedLink)
        {
            PhotoDocument photoDocumentWithSharedLink;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(_photoApiUrl);
                
                var content = new StringContent(sharedLink);
                
                var httpResponse = await (client.PutAsync($"{_photoApiUrl}api/photos/shared/{id}", content));
                
                var jsonResponse = await httpResponse.Content.ReadAsStringAsync();
                
                photoDocumentWithSharedLink = JsonConvert.DeserializeObject<PhotoDocument>(jsonResponse);
            }

            return photoDocumentWithSharedLink;
        }
		
        public Task Delete(int id)
        {
            throw new System.NotImplementedException();
        }

        public async Task ProcessSharedPhoto(SharedPhoto sharedPhoto)
        {
            var alreadyShared =  await Context.SharedPhotos.
                                FirstOrDefaultAsync(shared => 
                                    shared.UserId == sharedPhoto.UserId && shared.PhotoId == sharedPhoto.PhotoId);
            
            if (alreadyShared == null)
            {
                await Context.SharedPhotos.AddAsync(sharedPhoto);
                await Context.SaveChangesAsync();
            }
        }
    }
}