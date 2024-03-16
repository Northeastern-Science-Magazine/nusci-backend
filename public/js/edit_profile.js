document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Get form data
        const formData = new FormData(form);

        // Convert form data to JSON
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        try {
            // Make PUT request to update profile
            const response = await fetch(window.location.href, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            window.location.href = '/profile';

        } catch (error) {
            console.log("help");
            console.error(error.message);
        }
    });
});