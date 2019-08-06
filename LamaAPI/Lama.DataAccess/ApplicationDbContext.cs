using Lama.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess
{
    public partial class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public virtual DbSet<Album> Albums { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<Favorite> Favorites { get; set; }
        public virtual DbSet<Like> Likes { get; set; }
        public virtual DbSet<Location> Locations { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<Photo> Photos { get; set; }
        public virtual DbSet<PhotoAlbum> PhotoAlbums { get; set; }
        public virtual DbSet<PhotoState> PhotoStates { get; set; }
        public virtual DbSet<SearchHistory> SearchHistories { get; set; }
        public virtual DbSet<SharedAlbum> SharedAlbums { get; set; }
        public virtual DbSet<SharedPhoto> SharedPhotos { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Video> Videos { get; set; }
        public virtual DbSet<VideoAlbum> VideoAlbums { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Album>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.Photo).WithOne(o => o.Album).HasForeignKey<Album>(fk => fk.CoverId);
                entity.HasOne(o => o.User).WithMany(m => m.Albums).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.ClientSetNull);
                entity.Property(e => e.Title).IsRequired();
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.Categories).HasForeignKey(fk => fk.UserId);
                entity.Property(e => e.Name).IsRequired();
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.Comments).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.ClientSetNull);
                entity.HasOne(o => o.Photo).WithMany(m => m.Comments).HasForeignKey(fk => fk.PhotoId);
                entity.Property(e => e.Text).IsRequired();
            });

            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.Favorites).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.ClientSetNull);
                entity.HasOne(o => o.Photo).WithMany(m => m.Favorites).HasForeignKey(fk => fk.PhotoId);
            });

            modelBuilder.Entity<Like>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.Likes).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.ClientSetNull);
                entity.HasOne(o => o.Photo).WithMany(m => m.Likes).HasForeignKey(fk => fk.PhotoId);
            });

            modelBuilder.Entity<Location>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.Locations).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.Notifications).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.ClientSetNull);
                entity.Property(e => e.Text).IsRequired();
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.IsRead).IsRequired();
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
            });

            modelBuilder.Entity<PhotoAlbum>(entity =>
            {
                entity.HasKey(k => new { k.PhotoId, k.AlbumId });
                entity.HasOne(o => o.Album).WithMany(m => m.PhotoAlbums).HasForeignKey(fk => fk.AlbumId);
                entity.HasOne(o => o.Photo).WithMany(m => m.PhotoAlbums).HasForeignKey(fk => fk.PhotoId).OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<PhotoState>(entity =>
            {
                entity.HasKey(k => k.PhotoId);
                entity.HasOne(o => o.Photo).WithOne(o => o.PhotoState).HasForeignKey<PhotoState>(fk => fk.PhotoId);
                entity.Property(e => e.Height).IsRequired();
                entity.Property(e => e.RotateDegree).IsRequired();
                entity.Property(e => e.Width).IsRequired();
            });

            modelBuilder.Entity<SearchHistory>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.SearchHistories).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.ClientSetNull);
                entity.Property(e => e.Text).IsRequired();
                entity.Property(e => e.SearchDate).IsRequired();
            });

            modelBuilder.Entity<SharedAlbum>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.SharedAlbums).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.ClientSetNull);
                entity.HasOne(o => o.Album).WithOne(o => o.SharedAlbum).HasForeignKey<SharedAlbum>(fk => fk.AlbumId);
            });

            modelBuilder.Entity<SharedPhoto>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.SharedPhotos).HasForeignKey(fk => fk.UserId).OnDelete(DeleteBehavior.ClientSetNull);
                entity.HasOne(o => o.Photo).WithOne(m => m.SharedPhoto).HasForeignKey<SharedPhoto>(fk => fk.PhotoId);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.Photo).WithOne(o => o.User).HasForeignKey<User>(fk => fk.AvatarId);
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.FirstName).IsRequired();
                entity.Property(e => e.LastName).IsRequired();
            });

            modelBuilder.Entity<Video>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasKey(k => k.Id);
                entity.HasOne(o => o.User).WithMany(m => m.Videos).HasForeignKey(fk => fk.UserId);
            });

            modelBuilder.Entity<VideoAlbum>(entity =>
            {
                entity.HasKey(k => new { k.VideoId, k.AlbumId });
                entity.HasOne(o => o.Video).WithMany(m => m.VideoAlbums).HasForeignKey(fk => fk.VideoId).OnDelete(DeleteBehavior.ClientSetNull);
                entity.HasOne(o => o.Album).WithMany(m => m.VideoAlbums).HasForeignKey(fk => fk.AlbumId);
            });
        }
    }
}
