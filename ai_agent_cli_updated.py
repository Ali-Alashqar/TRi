"""
AI Agent CLI - مع دعم سياق المحادثة
"""

import sys
import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

KNOWLEDGE_BASE = {
    "contact": {
        "keywords": ["رقم", "هاتف", "تواصل", "اتصال", "موبايل", "جوال", "ايميل", "بريد", "email", "phone"],
        "info": """معلومات التواصل مع جامعة عمان العربية:
📞 الهاتف: 0798877440
🌐 الموقع: https://www.aau.edu.jo/ar
📍 العنوان: شارع الأردن، مبيس - عمان، الأردن
⏰ أوقات العمل: من الأحد إلى الخميس"""
    },
    "technest": {
        "keywords": ["تكنست", "فريق", "team", "technest"],
        "info": """فريق TechNest - فريق رائع من جامعة عمان العربية:
🎮 متخصصون في تطوير الألعاب والتطبيقات
💡 فريق مبدع وموهوب من طلاب وخريجي الجامعة
🔗 الموقع: https://technestjo.dev
📧 الانضمام: https://technestjo.dev/join-us"""
    }
}

tools = [
    {
        "type": "function",
        "function": {
            "name": "search_aau_knowledge",
            "description": "البحث في قاعدة معرفة جامعة عمان العربية",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "الاستعلام المراد البحث عنه"
                    }
                },
                "required": ["query"]
            }
        }
    }
]

def search_aau_knowledge(query):
    query_lower = query.lower()
    for category, data in KNOWLEDGE_BASE.items():
        keywords = data.get("keywords", [])
        if any(keyword in query_lower for keyword in keywords):
            return data.get("info", "لم أجد معلومات")
    return f"لم أجد معلومات عن '{query}'. اتصل على 0798877440"

SYSTEM_MESSAGE = """أنت Tec 🤖، مساعد ذكي في جامعة عمان العربية.
- اجب على الأسئلة بناءً على السياق السابق للمحادثة
- استخدم المعلومات من قاعدة المعرفة
- كن ودياً واحترافياً
- استخدم الإيموجي بشكل مناسب"""

def chat(message, conversation_history=None):
    try:
        messages = [{"role": "system", "content": SYSTEM_MESSAGE}]
        
        if conversation_history:
            for hist_msg in conversation_history:
                messages.append({
                    "role": hist_msg.get("role", "user"),
                    "content": hist_msg.get("content", "")
                })
        
        messages.append({"role": "user", "content": message})
        
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls
        
        if tool_calls:
            messages.append(response_message)
            
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                if function_name == "search_aau_knowledge":
                    function_response = search_aau_knowledge(function_args.get("query"))
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": function_response
                    })
            
            second_response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=messages
            )
            return second_response.choices[0].message.content
        else:
            return response_message.content
    
    except Exception as e:
        return f"عذراً، حدث خطأ: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No message provided"}))
        sys.exit(1)
    
    message = sys.argv[1]
    conversation_history = None
    
    if len(sys.argv) > 2:
        try:
            conversation_history = json.loads(sys.argv[2])
        except:
            conversation_history = None
    
    response = chat(message, conversation_history)
    print(json.dumps({"response": response}, ensure_ascii=False))
