using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Lama.BusinessLogic.Services;
using Lama.Domain.DTO.User;
using Lama.Infrastructure;
using Microsoft.AspNetCore.Authorization;


namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;
        private IUserProtectionService _userProtectionService;

        public UsersController(UserService service, IUserProtectionService userProtectionService)
        {
            _service = service;
            _userProtectionService = userProtectionService;
        }

        [HttpPost]
        public async Task<int> RegisterUser([FromBody] UserDTO user)
        {
            var userDTO = await _service.GetByEmail(user.Email);
            var userId = userDTO?.Id ?? await _service.Create(user);

            return userId;
        }
        
        [HttpPut]
        public async Task<int> UpdateUser([FromBody] UserDTO user)
        {
            return await _service.UpdateUser(user);
        }

        [HttpGet("{id}")]
        public async Task<UserDTO> Get(int id)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return await _service.Get(currentUserId);
        }

        [HttpGet("email")]
        public async Task<UserDTO> GetByEmail([FromHeader] string email)
        {
            return await _service.GetByEmail(email);
        }
    }
}
