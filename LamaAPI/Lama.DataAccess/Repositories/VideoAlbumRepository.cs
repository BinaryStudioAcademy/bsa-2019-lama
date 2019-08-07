using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class VideoAlbumRepository : IRepository<VideoAlbum>
    {
        private readonly ApplicationDbContext _db;

        public VideoAlbumRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(VideoAlbum item)
        {
            await _db.VideoAlbums.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<VideoAlbum> ReadAsync(int id)
        {
            return await _db.VideoAlbums.FindAsync(id);
        }

        public async Task UpdateAsync(int id, VideoAlbum item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            VideoAlbum v = await ReadAsync(id);
            if (v != null)
                _db.VideoAlbums.Remove(v);
            await _db.SaveChangesAsync();
        }

        public async Task<List<VideoAlbum>> GetAllAsync()
        {
            return await _db.VideoAlbums.ToListAsync();
        }

        public async Task<List<VideoAlbum>> FindAsync(Func<VideoAlbum, bool> predicate)
        {
            return await _db.VideoAlbums.Where(predicate).AsQueryable().ToListAsync();
        }
    }
}
