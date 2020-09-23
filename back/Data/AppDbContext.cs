using Microsoft.EntityFrameworkCore;
using back.Data;

namespace back 
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base (options)
        {}
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<Card>()
                .HasOne(b => b.Creator);
            
            modelBuilder
                .Entity<User>()
                .HasIndex(a => a.Email)
                .IsUnique();

            modelBuilder
                .Entity<CardAttempt>();
                
        }

        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Card> Cards { get; set; } = default!;
        public DbSet<CardAttempt> CardAttempts { get; set; } = default!;
        public DbSet<UserSettings> UserSettings { get; set; } = default!;
    } 
}