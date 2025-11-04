namespace ChatAppServer.WebApi.DTOs
{
    public sealed record SendMessageDto(
        Guid UserId,
        Guid ToUserId,
        string Message);

}
