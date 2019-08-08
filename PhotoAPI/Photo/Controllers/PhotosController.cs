using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Photo.BusinessLogic.Services;
using Photo.Domain.BlobModels;

namespace Photo.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        PhotoService _service;
        public PhotosController(PhotoService service)
        {
            _service = service;
        }
        // GET api/values
        [HttpGet]
        public async Task<IEnumerable<PhotoDocument>> Get()
        {
            return await _service.GetAll();
        }
        
        [HttpGet("/shared")]
        public ActionResult<IEnumerable<string>> GetShared()
        {
            return new string[] { "photo1", "photo2" };
        }


        //// GET api/values/5
        //[HttpGet("{id}")]
        //public ActionResult<string> Get(int id)
        //{
        //    return "photo";
        //}

        // POST api/values
        [HttpPost]
        public async Task Post([FromBody] PhotoReceived[] values)
        {
            await _service.CreateAll(values);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
