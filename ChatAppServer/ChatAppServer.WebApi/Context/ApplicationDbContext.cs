using ChatAppServer.WebApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatAppServer.WebApi.Context
{
    public sealed class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Chat> Chats { get; set; }
        public DbSet<User> Users { get; set; }

    }
}
