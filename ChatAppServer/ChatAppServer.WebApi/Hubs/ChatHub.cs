using ChatAppServer.WebApi.Context;
using ChatAppServer.WebApi.Models;
using Microsoft.AspNetCore.SignalR;
using System.Threading;

namespace ChatAppServer.WebApi.Hubs
{
    public sealed class ChatHub(
        ApplicationDbContext context) : Hub
    {

        public static Dictionary<string, Guid> Users = new();

        public async Task Connect(Guid userId)
        {
            Users.Add(Context.ConnectionId, userId);

            User? user = await context.Users.FindAsync(userId);

            if (user != null)
            {
                user.Status = "Online";
                await context.SaveChangesAsync();

                // Inform frontend of the changes
                await Clients.All.SendAsync("Users", user);

            }

        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {

            Guid userId;
            Users.TryGetValue(Context.ConnectionId, out userId);
            Users.Remove(Context.ConnectionId);

            User? user = await context.Users.FindAsync(userId);

            if (user != null)
            {
                user.Status = "Offline";
                await context.SaveChangesAsync();

                // Inform frontend of the changes
                await Clients.All.SendAsync("Users", user);

            }

        }

    }
}
