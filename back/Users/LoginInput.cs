using back.Data;

namespace back.Users
{
    public class LoginPayload
    {
        public LoginPayload(User loggedInUser, string token, string scheme, string? clientMutationId)
        {
            LoggedInUser = loggedInUser;
            Token = token;
            Scheme = scheme;
            ClientMutationId = clientMutationId;
        }

        public User LoggedInUser { get; }
        public string Token { get; }
        public string Scheme { get; }
        public string? ClientMutationId { get; }
    }

    public class LoginInput
    {
        public LoginInput(
            string email,
            string password,
            string? clientMutationId)
        {
            Email = email;
            Password = password;
            ClientMutationId = clientMutationId;
        }

        public string Email { get; }
        public string Password { get; }
        public string? ClientMutationId { get; }
    }
}