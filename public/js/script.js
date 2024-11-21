

    document.addEventListener('DOMContentLoaded', () => {
        // Wait for fonts and critical resources
        document.fonts.ready.then(() => {
            document.body.classList.add('loaded');
        });
    
        // Fallback timeout
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
    });

function toggleDrinks(cat){
    console.log(cat);
    const drinks = document.getElementById(cat);
    drinks.classList.toggle('show');
}
