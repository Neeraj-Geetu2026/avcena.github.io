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
        Assert.Contains("\"status\":\"ok\"", await response.Content.ReadAsStringAsync());
    }
}
