const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();

// Настройка CORS и обработка JSON
app.use(cors());
app.use(express.json());

// ВАЖНО: Раздача статических файлов
// Позволяет серверу отдавать картинки из папки /img и файлы сайта (index.html, admin.html)
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.static(__dirname));

// Инициализация Supabase (используем переменные окружения Vercel)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://npqrghhygmzuqxyhynb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// API Endpoint: Получение списка всех блюд из Supabase
app.get('/api/dishes', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('dishes')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (err) {
        console.error('Помилка отримання даних:', err.message);
        res.status(500).json({ error: 'Не вдалося завантажити меню' });
    }
});

// Отдача главной страницы по умолчанию
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера (для локальной разработки или Vercel Serverless)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Сервер запущено на порту ${PORT}`);
    });
}

module.exports = app;
