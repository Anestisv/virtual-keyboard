// ---------------- DARK THEME ---------------- \\
const themeButton = document.querySelector('.theme_icon');
const darkTheme = 'dark_theme';

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle('material-icons-outlined')
});