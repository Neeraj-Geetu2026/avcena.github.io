using Microsoft.AspNetCore.Mvc.Testing;

namespace Avcena.Api.Tests;

public class UnitTest1
{
    [Fact]
    public async Task Health_endpoint_returns_ok()
    {
        await using var application = new WebApplicationFactory<Program>();
        using var client = application.CreateClient();

        using var response = await client.GetAsync("/health");

        response.EnsureSuccessStatusCode();
        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.Equal("DENY", response.Headers.GetValues("X-Frame-Options").Single());
        Assert.Contains("\"status\":\"ok\"", await response.Content.ReadAsStringAsync());
    }
}
