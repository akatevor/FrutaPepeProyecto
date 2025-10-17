using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using System;

[ApiController]
[Route("api/loginapi")]
public class LoginApiController : ControllerBase
{
    private readonly ConexionMySql _db;

    public LoginApiController(ConexionMySql db)
    {
        _db = db;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginViewModel model)
    {
        if (model == null || string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            return BadRequest(new { message = "Username and password required" });

        var user = _db.ObtenerUsuario(model.Username, model.Password);
        if (user == null) return Unauthorized(new { message = "Invalid credentials" });

        // For development we return a simple fake token and user info
        var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

        return Ok(new { token, user = new { username = user.Username, rol = user.Rol } });
    }

    [HttpGet("validate")]
    public IActionResult Validate()
    {
        // Very simple validate: if Authorization header present return 200
        var auth = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(auth)) return Unauthorized(new { message = "Missing Authorization" });

        return Ok(new { valid = true });
    }
}
