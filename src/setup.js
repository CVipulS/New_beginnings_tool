document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('setup-form');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.querySelector('input[name="theme"]').value = savedTheme;
    }
    const categorySelect = document.getElementById('category');
    const point1Input = document.querySelector('input[name="point1"]');
    const point2Input = document.querySelector('input[name="point2"]');
    const point3Input = document.querySelector('input[name="point3"]');

    // Populate points when category changes
    categorySelect.addEventListener('change', () => {
        const selectedCategory = categorySelect.value;
        document.getElementById('category-description').textContent = agendaCategories[selectedCategory];
        const agenda = JSON.parse(localStorage.getItem('agenda')) || {};
        const points = agenda[selectedCategory] || { point1: '', point2: '', point3: '' };
        point2Input.parentElement.style.display = (selectedCategory === 'Reporting') ? 'none' : '';
        point3Input.parentElement.style.display = (selectedCategory === 'Reporting' || selectedCategory === 'Creativity') ? 'none' : '';
        point1Input.value = points.point1;
        point2Input.value = points.point2;
        point3Input.value = points.point3;
    });

    // Populate points for the initial selected category
    categorySelect.dispatchEvent(new Event('change'));

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const theme = document.querySelector('input[name="theme"]').value;
        localStorage.setItem('theme', theme);
        
        const category = categorySelect.value;
        const agendaPoints = {
            point1: point1Input.value,
            point2: point2Input.value,
            point3: point3Input.value,
        };
        
        let agenda = JSON.parse(localStorage.getItem('agenda')) || {};
        agenda[category] = agendaPoints;
        localStorage.setItem('agenda', JSON.stringify(agenda));
        
        alert('Settings saved!');
    });

    // For consuming GitHub Model to get suggestion
    document.getElementById('ai-suggestion-form').addEventListener('submit', (event) => {
        event.preventDefault();
        fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.querySelector('input[name="GitHubToken"]').value}`
            },
            body: JSON.stringify({
                "messages": [
                    {
                        "role": "user",
                        "content": `Suggest ${document.querySelector('input[name="theme"]').value} theme specific exactly one ${document.getElementById('category').value} category agenda point.`
                    }
                ],
                "temperature": 1.0,
                "top_p": 1.0,
                "max_tokens": 1000,
                "model": "Phi-4"
            })
        })
        .then(response => response.json())
        .then(data => {
            const converter = new showdown.Converter();
            const htmlContent = converter.makeHtml(data.choices[0].message.content);
            document.querySelector('#suggested').innerHTML = "<h4>Response:</h4>" + htmlContent;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

});
