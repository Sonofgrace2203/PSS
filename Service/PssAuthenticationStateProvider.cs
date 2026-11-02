
using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;

namespace pss.Services;

public sealed class PssAuthenticationStateProvider
    : AuthenticationStateProvider, IDisposable
{
    private readonly AuthService _authService;

    public PssAuthenticationStateProvider(AuthService authService)
    {
        _authService = authService;
        _authService.AuthenticationStateChanged += OnAuthenticationStateChanged;
    }

    public override Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        var user = _authService.CurrentUser;

        if (user is null || !_authService.IsAuthenticated)
        {
            var anonymous = new ClaimsPrincipal(new ClaimsIdentity());

            return Task.FromResult(new AuthenticationState(anonymous));
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.UserId),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Email, user.Email)
        };

        foreach (var role in user.Roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var identity = new ClaimsIdentity(claims, "PssAuth");
        var principal = new ClaimsPrincipal(identity);

        return Task.FromResult(new AuthenticationState(principal));
    }

    private void OnAuthenticationStateChanged()
    {
        NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
    }

    public void Dispose()
    {
        _authService.AuthenticationStateChanged -= OnAuthenticationStateChanged;
    }
}
