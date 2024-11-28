describe("Example test suite", () => {
  test("Example fetch test", async () => {
    const response = await fetch("http://localhost:9999/user/email/sutton@sutton.com");
    const payload = await response.json();

    expect(payload).toMatchObject({
      firstName: "Sutton",
      lastName: "S",
      pronouns: [],
      graduationYear: 2026,
      major: "Computer Science",
      location: "California",
      profileImage: "https://example.com/profile.jpg",
      bannerImage: "https://example.com/banner.jpg",
      bio: "Teaching & Technical Assistant",
      email: "sutton@sutton.com",
      roles: ["developer"],
      creationTime: "2024-02-28T00:00:00.000Z",
      modificationTime: "2024-02-28T00:00:00.000Z",
    });
  });
});
