# LLM Session with Weather Tool

## Available Tools

```json
{
  "tools": [
    {
      "name": "getWeather",
      "description": "ability to get weather in location",
      "input": ["loc: string"],
      "output": {
        "temp": "float",
        "conditions": "string"
      }
    }
  ]
}
```

## Conversation

### User Query
```json
{
  "role": "user",
  "content": "What's the weather like in Tel Aviv today?"
}
```

### Assistant Response
```json
{
  "role": "assistant",
  "content": "I'll check the current weather in Tel Aviv for you."
}
```

### Tool Calling
```json
{
  "role": "assistant",
  "tool": "getWeather",
  "params": ["tel aviv"]
}
```

### Tool Response
```json
{
  "role": "tool",
  "name": "getWeather",
  "response": {
    "temp": 28.5,
    "conditions": "Sunny with clear skies"
  }
}
```

### Final Answer
```json
{
  "role": "assistant",
  "content": "The current weather in Tel Aviv is 28.5°C with sunny and clear skies."
} 