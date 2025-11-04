using ChatAppServer.WebApi.Context;
using ChatAppServer.WebApi.DTOs;
using ChatAppServer.WebApi.Hubs;
using ChatAppServer.WebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatAppServer.WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ChatController(
        ApplicationDbContext context,
        IHubContext<ChatHub> hubContext) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetChats(Guid userId, Guid toUserId, CancellationToken cancellationToken)
        {

            List<Chat> chats = await context.Chats
                .Where(
                    user =>
                    user.UserId == userId && user.ToUserId == toUserId
                    ||
                    user.ToUserId == userId && user.UserId == toUserId)
                .OrderBy(user => user.Date)
                .ToListAsync(cancellationToken);

            return Ok(chats);

        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(SendMessageDto request, CancellationToken cancellationToken)
        {

            Chat chat = new()
            {

                UserId = request.UserId,
                ToUserId = request.ToUserId,
                Message = request.Message,
                Date = DateTime.Now

            };

            await context.AddAsync(chat, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);

            string connectionId = ChatHub.Users.First(x => x.Value == chat.ToUserId).Key;

            await hubContext.Clients.Client(connectionId).SendAsync("Messages", chat);

            return Ok(chat);

        }

        [HttpGet]
        public async Task<IActionResult> GetUsers(CancellationToken cancellationToken)
        {
            List<User> users = await context.Users
                .OrderBy(x => x.Name)
                .ToListAsync(cancellationToken);

            return Ok(users);
        }

    }
}