using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        [HttpPost]
        [DataType(DataType.Upload)]
        public void ReceivePhoto([FromBody]Photo Photo)
        {
            Console.WriteLine(Photo);
            
        }
    }
}