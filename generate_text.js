export async function generateText({
    message,
    provider,
    model = null,
    imageBytes = null,
    maxTokens = 150,
    temperature = 0.7,
    stream = false,
    system = null,
    messages = [],
    reasoningEffort = null,
    auth = {username: 'developer', password: 'developer'},
    baseUrl = 'http://185.180.230.207:8001'
  }) {
    // Валидация провайдера (пример значений)
    const validProviders = ['openai', 'gemini', 'claude', 'huggingface'];
    if (!validProviders.includes(provider)) {
      throw new Error(`Invalid provider: ${provider}. Valid providers: ${validProviders.join(', ')}`);
    }
  
    // Подготовка базового URL
    baseUrl = baseUrl.replace(/\/$/, '');
  
    // Формирование payload
    const payload = {
      message,
      provider,
      model,
      max_tokens: maxTokens,
      temperature,
      stream,
      system: system || '',
      messages,
      reasoning_effort: reasoningEffort
    };
  
    // Обработка изображения
    if (imageBytes !== null) {
      if (imageBytes instanceof Uint8Array || imageBytes instanceof ArrayBuffer) {
        payload.image_bytes = bufferToBase64(imageBytes);
      } else if (typeof imageBytes === 'string') {
        payload.image_bytes = imageBytes;
      } else {
        throw new Error('imageBytes must be Uint8Array, ArrayBuffer or base64 string');
      }
    }
  
    // Настройка заголовков
    const headers = {
      'Content-Type': 'application/json'
    };
  
    // Добавление аутентификации
    if (auth) {
      const credentials = btoa(`${auth.username}:${auth.password}`);
      headers.Authorization = `Basic ${credentials}`;
    }
  
    // Отправка запроса
    const response = await fetch(`${baseUrl}/text`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
  
    // Обработка ошибок
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message;
      } catch {
        errorMessage = response.statusText;
      }
      throw new Error(`API request failed: ${errorMessage} (status: ${response.status})`);
    }
  
    // Обработка потокового ответа
    if (stream) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      return (async function* () {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) return;
            yield decoder.decode(value);
          }
        } finally {
          reader.releaseLock();
        }
      })();
    }
  
    // Обработка обычного ответа
    const data = await response.json();
    return data.result || data.generated_text || JSON.stringify(data);
  }
  
  // Вспомогательная функция для конвертации бинарных данных в base64
  function bufferToBase64(buffer) {
    if (typeof Buffer !== 'undefined') {
      // Node.js environment
      return Buffer.from(buffer).toString('base64');
    }
    
    // Browser environment
    const binary = Array.from(new Uint8Array(buffer))
      .map(byte => String.fromCharCode(byte))
      .join('');
    return btoa(binary);
  }

