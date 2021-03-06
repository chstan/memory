using back.Data;

namespace back.Users
{
    public class AddUserPayload 
    {
        public AddUserPayload(User user, string? clientMutationId)
        {
            User = user;
            ClientMutationId = clientMutationId;
        }

        public User User { get; }
        public string? ClientMutationId { get; }
    }
    public class AddUserInput 
    {
        public AddUserInput(string name, string email, string password, string? clientMutationId)
        {
            Name = name;
            Email = email;
            Password = password;
            ClientMutationId = clientMutationId;
        }

        public string Name { get; }
        public string Email { get; }
        public string Password { get; }
        public string? ClientMutationId { get; }

    }
}