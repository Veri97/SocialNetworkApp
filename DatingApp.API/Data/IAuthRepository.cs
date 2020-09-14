using DatingApp.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    public interface IAuthRepository
    {
        //metode per regjistrimin e userit
        Task<User> Register(User user, string password);


        //metode per login ne API
        Task<User> Login(string username, string password);

        //metode qe kontrollon ne db nese nje user(me username te caktuar) ekziston apo jo duke e krahasuar me username qe japim si input
        Task<bool> UserExists(string username);

    }
}
