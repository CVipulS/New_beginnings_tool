function displayAgenda(agenda) {
    Object.entries(agendaCategories).forEach(([category, description]) => {
        const myCategory = document.createElement('section');
        myCategory.className = 'container';
        
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        categoryTitle.title = description;
        myCategory.appendChild(categoryTitle);
        
        const agendaPointsList = document.createElement('ul');
        const agendaPoints = agenda[category] || { point1: '', point2: '', point3: '' };
        Object.values(agendaPoints).forEach(agendaPoint => {
            if (!agendaPoint) {
                return;
            }
            const agendaPointItem = document.createElement('li');
            agendaPointItem.textContent = agendaPoint;
            agendaPointsList.appendChild(agendaPointItem);
        });
        
        myCategory.appendChild(agendaPointsList);
        document.body.insertBefore(myCategory, document.body.lastElementChild.previousElementSibling);
    });
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const themeParagraph = document.createElement('p');
        themeParagraph.textContent = `Curating ${savedTheme} for growing effectively`;
        document.body.insertBefore(themeParagraph, document.body.firstElementChild.nextElementSibling);
        const agenda = JSON.parse(localStorage.getItem('agenda')) || {};
        displayAgenda(agenda);
    }
});
