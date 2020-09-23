using Microsoft.AspNetCore.Mvc;

namespace back.Controllers
{
    [ApiController]
    [Route(["[controller]"])]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;

        public UsersController(IUserService userService) 
        {
            _userService = userService;
        }

        [HttpPost("authenticate")]
        public IActionResult Authenticate(AuthenticateRequest model)
        {
            var response = _userService.Authenticate(model);

            if (response == null)
                return BadRequest(new { message = "Email or password is incorrect."});
            
            return Ok(response);
        }
    }
}