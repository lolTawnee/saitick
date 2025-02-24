import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js';

// Инициализация модели
let generator;

// Массив случайных промтов
const randomPrompts = [
    "Как улучшить зрительное восприятие?",
    "Как развить слуховую чувствительность?",
    "Как исследовать тактильные ощущения?",
    "Как изучить обонятельные способности?",
    "Как понять вкусовые предпочтения?"
];

// Функция для генерации текста
const generateText = async (prompt) => {
    if (!generator) {
        generator = await pipeline('text-generation', 'Xenova/gpt-neo-125M');
    }
    const output = await generator(prompt, {
        max_length: 500,
    });
    return output[0].generated_text;
};

// Функция для получения случайного промта
const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * randomPrompts.length);
    return randomPrompts[randomIndex];
};

// Основная функция для генерации идей
window.generate = async () => {
    const prompt1 = document.getElementById('idea-prompt1').value;
    const prompt2 = document.getElementById('idea-prompt2').value;
    const randomPrompt = getRandomPrompt();

    // Генерация текста для каждого промта
    const resultA = await generateText(prompt1);
    const resultB = await generateText(randomPrompt);
    const resultC = await generateText(prompt2);

    // Вывод результатов в таблицу
    document.getElementById('columnA').textContent = resultA;
    document.getElementById('columnB').textContent = resultB;
    document.getElementById('columnC').textContent = resultC;
};