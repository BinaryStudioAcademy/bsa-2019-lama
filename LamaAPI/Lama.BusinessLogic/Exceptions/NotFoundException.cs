using System;

namespace Lama.BusinessLogic.Exceptions
{
    public class NotFoundException: Exception
    {
        public NotFoundException(string name, int id):base($"Entity {name} with id {id} was not found")
        {
        }
    }
}