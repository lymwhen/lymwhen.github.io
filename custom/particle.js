// 创建粒子效果
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth <= 768 ? 20 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// 页面加载完成后创建粒子
window.addEventListener('load', createParticles);