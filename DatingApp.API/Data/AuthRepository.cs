using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    //ne Repository pattern, implementimi i repository-t ben query-te ne databaze nepermjet Entity Framework
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);

            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;

        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            //HMACSHA512 kete here i kalojme passwordSalt si key, ne menyre qe te gjeneroje hash
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                for(int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }
            }

            //nese hash-et perputhen, passwordi eshte i sakte
            return true;
        }


        /*merr si parameter modelin e userit dhe passwordin (ne menyre qe ta regjistroje userin) , dhe kete password duhet ta
        sigurojme me hashing dhe salting per ta ruajtur me pas ne databaze*/
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;

            /*variablat passwordHash dhe passwordSalt i kalojme si referenca , dhe jo si vlera
            kete gje e bejme duke i kaluar parametrat me keywordin 'out' perpara.
            Pra kjo nenkupton qe sa here variablat passwordHash dhe passwordSalt ndryshojne/update-ohen brenda 
            metodes CreatePasswordHash, kjo te reflektohet edhe tek variablat brenda metodes Register*/
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;   //passwordSalt eshte sa hmac.Key , pra nje stringe random
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)); //passwordHash mban hashin e passwordit
            }
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(x => x.Username == username))
                return true;

            return false;
        }
    }
}
