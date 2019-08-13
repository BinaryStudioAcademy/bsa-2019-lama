using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO
{
    public class FavoriteDTO
    {
        public int PhotoId { get; set; }
        public FavoriteState State { get; set; }
    }

    public enum FavoriteState
    {
        None,
        Favorite,
        MarkedToFavorite,
        UnmarkedFavorite
    };
}
