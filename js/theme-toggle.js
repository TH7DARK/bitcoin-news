// Funcionalidade de alternância de tema (Dark Mode)
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    const themeText = themeToggleBtn.querySelector('span');
    
    // Verificar se há preferência de tema salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateToggleButton(true);
    }
    
    // Adicionar evento de clique ao botão
    themeToggleBtn.addEventListener('click', function() {
        // Verificar o tema atual
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDarkMode) {
            // Mudar para modo claro
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateToggleButton(false);
        } else {
            // Mudar para modo escuro
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateToggleButton(true);
        }
    });
    
    // Função para atualizar o botão de alternância
    function updateToggleButton(isDarkMode) {
        if (isDarkMode) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeText.textContent = 'Dark Mode';
        }
    }
    
    // Verificar preferência do sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Se não houver tema salvo, usar a preferência do sistema
    if (!savedTheme) {
        if (prefersDarkScheme.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateToggleButton(true);
        }
    }
    
    // Ouvir mudanças na preferência do sistema
    prefersDarkScheme.addEventListener('change', function(e) {
        // Apenas aplicar se o usuário não tiver definido uma preferência
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                updateToggleButton(true);
            } else {
                document.documentElement.removeAttribute('data-theme');
                updateToggleButton(false);
            }
        }
    });
});
