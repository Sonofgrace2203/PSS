
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Text.Json;
using pss.Models;

namespace pss.Services;

public sealed class AuthService
{
    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _jsonOptions =
        new(JsonSerializerDefaults.Web);

    public AuthService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public AuthResponse? CurrentUser { get; private set; }

    public bool IsAuthenticated =>
        CurrentUser is not null &&
        CurrentUser.ExpiresAtUtc > DateTime.UtcNow;

    public event Action? AuthenticationStateChanged;


    public async Task<(bool Success, string Message)> RegisterAsync(
        RegisterRequest request)
    {
        try
        {
            using var response = await _httpClient.PostAsJsonAsync(
                "api/auth/register",
                request);

            var result = await response.Content
                .ReadFromJsonAsync<RegistrationErrorResponse>(_jsonOptions);

            if (response.IsSuccessStatusCode)
            {
                return (
                    true,
                    result?.Message ?? "Account created successfully."
                );
            }

            if (result?.Errors.Count > 0)
            {
                return (
                    false,
                    string.Join(" ", result.Errors)
                );
            }

            return (
                false,
                result?.Message ?? "Registration failed. Please check your details."
            );
        }
        catch (HttpRequestException)
        {
            return (
                false,
                "Unable to connect to PSS. Please try again."
            );
        }
        catch (TaskCanceledException)
        {
            return (
                false,
                "The request timed out. Please try again."
            );
        }
        catch (JsonException)
        {
            return (
                false,
                "The server returned an invalid registration response."
            );
        }
    }


    public async Task<(bool Success, string Message)> LoginAsync(
        LoginRequest request)
    {
        try
        {
            using var response = await _httpClient.PostAsJsonAsync(
                "api/auth/login",
                request);

            if (!response.IsSuccessStatusCode)
            {
                return (
                    false,
                    response.StatusCode == System.Net.HttpStatusCode.Unauthorized
                        ? "Invalid email or password, or the account is inactive."
                        : "Login failed. Please try again."
                );
            }

            var result = await response.Content.ReadFromJsonAsync<AuthResponse>(
                _jsonOptions);

            if (result is null ||
                string.IsNullOrWhiteSpace(result.AccessToken) ||
                result.ExpiresAtUtc <= DateTime.UtcNow)
            {
                return (false, "The server returned an invalid login response.");
            }

            CurrentUser = result;

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", result.AccessToken);

            AuthenticationStateChanged?.Invoke();

            return (true, "Login successful.");
        }
        catch (HttpRequestException)
        {
            return (false, "Unable to connect to PSS. Please try again.");
        }
        catch (TaskCanceledException)
        {
            return (false, "The request timed out. Please try again.");
        }
        catch (JsonException)
        {
            return (false, "The server returned an invalid response.");
        }
    }

    public void Logout()
    {
        CurrentUser = null;
        _httpClient.DefaultRequestHeaders.Authorization = null;

        AuthenticationStateChanged?.Invoke();
    }

    private sealed class RegistrationErrorResponse
    {
        public string? Message { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
