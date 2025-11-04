using ChatAppServer.WebApi.Context;
using ChatAppServer.WebApi.DTOs;
using ChatAppServer.WebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatAppServer.WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController(
        ApplicationDbContext context) : ControllerBase
    {

        [HttpPost]
        public async Task<ActionResult> Register(RegisterDto request, CancellationToken cancellationToken)
        {
            
            bool isNameExist = await context.Users
                .AnyAsync(
                user => user.Name == request.Name,
                cancellationToken);

            if (isNameExist)
            {
                return BadRequest(new {Message = "Bu kullanıcı adı kullanımda."});
            }

            User user = new()
            {
                Name = request.Name,
                AvatarLink = request.AvatarLink,
                Status = "offline"
            };

            await context.Users.AddAsync(user, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);

            return Ok(user);

        }

        [HttpPost]
        public async Task<IActionResult> Login(string name, CancellationToken cancellationToken)
        {

            User? user = await context.Users
                .FirstOrDefaultAsync(user => user.Name == name, cancellationToken);

            if (user == null)
            {
                return BadRequest(new {Message = "Kullanıcı bulunamadı."});
            }

            user.Status = "online";

            await context.SaveChangesAsync(cancellationToken);

            return Ok(user);

        }

    }
}