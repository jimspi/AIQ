let currentStep = 0;
let score = 0;

const steps = document.querySelectorAll('[data-step]');
const loader = document.getElementById('loading');

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  const totalSteps = steps.length;
  const percent = Math.round((currentStep) / totalSteps * 100);
  progressBar.style.width = percent + '%';
  progressBar.setAttribute('aria-valuenow', percent);
  document.getElementById('progressPercent').innerText = `${percent}% Complete`;
}

function showStep(index) {
  steps.forEach((step, i) => step.classList.toggle('active', i === index));
  updateProgressBar();
}

function recordAnswer(points) {
  score += points;
  currentStep++;
  showStep(currentStep);
}

function recordTools() {
  const selectedTools = Array.from(document.querySelectorAll('input[name="tools"]:checked')).map(input => input.value);
  localStorage.setItem('aiTools', JSON.stringify(selectedTools)); // ✅ Save tools
  score += selectedTools.length * 5;
  currentStep++;
  showStep(currentStep);
}

function calculateScore() {
  const projectText = document.getElementById('projects').value.trim();
  localStorage.setItem('aiProjects', projectText); // ✅ Save projects
  score += Math.min(projectText.length / 10, 50);

  document.querySelector('.container').style.display = 'none';
  loader.style.display = 'block';

  setTimeout(() => {
    const tier = getTier(score);
    localStorage.setItem('aiScore', score.toFixed(0));
    localStorage.setItem('aiTier', tier);
    window.location.href = 'paywall.html';
  }, 1800);
}

function getTier(score) {
  if (score >= 100) return 'AI Mastermind';
  if (score >= 60) return 'AI Explorer';
  return 'AI Beginner';
}

window.addEventListener('DOMContentLoaded', () => {
  updateProgressBar();
});


