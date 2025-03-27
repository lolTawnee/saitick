// main.js

import { generateText } from "./generate_text.js";
// Массив случайных промтов
const randomPrompts = [
    "Как улучшить зрительное восприятие?",
    "Как развить слуховую чувствительность?",
    "Как исследовать тактильные ощущения?",
    "Как изучить обонятельные способности?",
    "Как понять вкусовые предпочтения?"
];
const promptsHierarchy = {
    hearing: {
        name: "Слух",
        subcategories: [
            {name: "Теории слуха", prompt: "Исследовать основные теории восприятия звука"},
            {name: "Звуковые волны", prompt: "Эксперименты с распространением звуковых волн"},
            {name: "Взаимодействие органов", prompt: "Как слух взаимодействует с другими чувствами?"}
        ]
    },
    vision: {
        name: "Зрение",
        subcategories: [
            {name: "Оптика глаза", prompt: "Изучить оптические свойства хрусталика"},
            {name: "Цветовосприятие", prompt: "Эксперименты с цветовыми иллюзиями"},
            {name: "Периферийное зрение", prompt: "Исследование границ зрительного восприятия"}
        ]
    },
    brain: {
        name: "Мозг",
        subcategories: [
            {name: "Нейронные связи", prompt: "Как формируются нейронные связи?"},
            {name: "Память", prompt: "Эксперименты с кратковременной памятью"},
            {name: "Реакция на стимулы", prompt: "Измерение скорости реакции мозга"}
        ]
    },
    smell: {
        name: "Обоняние",
        subcategories: [
            {name: "Химическая природа", prompt: "Анализ молекулярной структуры запахов"},
            {name: "Память и запахи", prompt: "Как запахи влияют на воспоминания?"},
            {name: "Адаптация", prompt: "Исследование привыкания к запахам"}
        ]
    }
};





// Функция для получения случайного промта
const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * randomPrompts.length);
    return randomPrompts[randomIndex];
};

// Исправленная функция generateHandler
export const generateHandler = async () => {
    const prompt1 = "1"//document.getElementById('idea-prompt1').value;
    const prompt2 = "2"//document.getElementById('idea-prompt2').value;
    const randomPrompt = getRandomPrompt();
  
    try {
      const results = await Promise.all([
        generateText ({
          message: prompt1,
          provider: "openai", // Жестко задаем параметры
          model: "gpt-4o-mini",
          auth: { username: "developer", password: "developer" }, // Явное указание
          baseUrl: "http://185.180.230.207:8001" // Полный URL
        }),
        generateText({
          message: randomPrompt,
          provider: "openai",
          model: "gpt-4o-mini",
          auth: { username: "developer", password: "developer" }, // Явное указание
          baseUrl: "http://185.180.230.207:8001" // Полный URL
        }),
        generateText({
          message: prompt2,
          provider: "openai",
          model: "gpt-4o-mini",
          auth: { username: "developer", password: "developer" }, // Явное указание
          baseUrl: "http://185.180.230.207:8001" // Полный URL
        })
      ]);
  
      // Обновление интерфейса
      //document.getElementById('columnA').textContent = results[0];
      //document.getElementById('columnB').textContent = results[1];
      //document.getElementById('columnC').textContent = results[2];

      try {
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 1,
                prompts: [prompt1, randomPrompt, prompt2],
                results
            })
        });
        
        const data = await response.json();
        console.log('Saved to DB:', data);
    } catch (error) {
        console.error('Error saving:', error);
    }

} catch (error) {
    console.error('Generation error:', error);
    alert('Произошла ошибка при генерации. Проверьте консоль для деталей.');
}
};
/*document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.first-level .prompt-button').forEach(button => {
        button.addEventListener('click', function() {
            const inputGroup = this.closest('.input-group');
            const secondLevel = inputGroup.querySelector('.second-level');
            const category = this.dataset.category;
            
            // Очищаем предыдущие подкатегории
            secondLevel.innerHTML = '';
            
            // Добавляем подкатегории
            promptsHierarchy[category].subcategories.forEach(sub => {
                const subButton = document.createElement('button');
                subButton.textContent = sub.name;
                subButton.dataset.prompt = sub.prompt;
                subButton.addEventListener('click', function() {
                    const input = inputGroup.querySelector('input');
                    input.value = this.dataset.prompt;
                });
                secondLevel.appendChild(subButton);
            });
            
            // Добавляем кнопку "Назад"
            const backButton = document.createElement('button');
            backButton.textContent = '← Назад';
            backButton.className = 'back-button';
            backButton.addEventListener('click', () => {
                inputGroup.querySelector('.first-level').classList.remove('hidden');
                secondLevel.classList.add('hidden');
            });
            secondLevel.appendChild(backButton);
            
            // Переключаем уровни
            inputGroup.querySelector('.first-level').classList.add('hidden');
            secondLevel.classList.remove('hidden');
            secondLevel.dataset.currentCategory = category;
        });
    });
    document.getElementById('idea-button').addEventListener('click', (generateHandler));
});*/
