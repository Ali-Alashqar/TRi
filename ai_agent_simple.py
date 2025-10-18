"""
AI Agent بسيط وفعال للبحث في موقع جامعة عمان العربية
يستخدم OpenAI مباشرة مع function calling
"""

import os
import json
from openai import OpenAI

# إعداد OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# قاعدة المعرفة الشاملة
KNOWLEDGE_BASE = {
    "contact": {
        "keywords": ["رقم", "هاتف", "تواصل", "اتصال", "موبايل", "جوال", "ايميل", "بريد", "email", "phone"],
        "info": """معلومات التواصل مع جامعة عمان العربية:
📞 الهاتف: 0798877440
🌐 الموقع الإلكتروني: https://www.aau.edu.jo/ar
📍 العنوان: شارع الأردن، مبيس - عمان، الأردن
⏰ أوقات العمل: من الأحد إلى الخميس
📱 وسائل التواصل الاجتماعي: Facebook, LinkedIn, Twitter, YouTube"""
    },
    "rankings": {
        "keywords": ["تصنيف", "ترتيب", "مرتبة", "إنجازات", "تميز", "ranking", "achievement"],
        "info": """إنجازات وتصنيفات جامعة عمان العربية:
🏆 دخول تصنيف QS العالمي 2026 للمرة الأولى
🥇 المرتبة 110 عربياً في تصنيف QS Arab Region 2025
🥇 المرتبة السادسة في تصنيف التايمز للجامعات العربية
🥇 المرتبة الرابعة أردنياً في تصنيف التايمز للتأثير 2025
🥇 المرتبة الأولى على الجامعات الخاصة في تصنيف ويبوميتركس 2025
🥇 المرتبة الأولى على الجامعات الخاصة والثانية أردنياً في تصنيف سيماجو 2025
🥇 المرتبة السادسة محلياً وضمن أول 388 جامعة عالمياً في تصنيف Green Metric 2024"""
    },
    "accreditations": {
        "keywords": ["اعتماد", "شهادة", "جودة", "معتمد", "accreditation", "quality"],
        "info": """الاعتمادات الدولية لجامعة عمان العربية:
✅ EUR-ACE: اعتماد دولي لهندسة البرمجيات (4 سنوات)
✅ AABI: الأولى عربياً والسادس عالمياً في اعتماد الطيران الدولي
✅ AACSB: اعتماد أمريكي لكلية الأعمال (مجدد)
✅ ACPE: اعتماد أمريكي لكلية الصيدلة
✅ IAA: موافقة أولية لاعتماد كلية الشريعة
✅ EASA: اعتماد وكالة سلامة الطيران الأوروبية
✅ ISO: شهادة الأيزو (2020-2027)"""
    },
    "majors": {
        "keywords": ["تخصص", "كلية", "برنامج", "دراسة", "بكالوريوس", "ماجستير", "major", "faculty"],
        "info": """الكليات والتخصصات في جامعة عمان العربية:
🎓 كلية الهندسة: هندسة البرمجيات (معتمدة EUR-ACE)، هندسة الطيران (معتمدة AABI و EASA)
💼 كلية الأعمال: معتمدة أمريكياً AACSB - إدارة، محاسبة، تسويق، مالية
💊 كلية الصيدلة: معتمدة أمريكياً ACPE
📖 كلية الشريعة: اعتماد دولي IAA
⚖️ كلية الحقوق
👨‍🏫 كلية العلوم التربوية والنفسية
💻 كلية تكنولوجيا المعلومات
📚 كلية الآداب والعلوم
✈️ كلية علوم الطيران
🏥 كلية العلوم الطبية التطبيقية
🔧 الكلية التقنية"""
    },
    "admission": {
        "keywords": ["قبول", "تسجيل", "التحاق", "طالب", "شروط", "admission", "registration"],
        "info": """القبول والتسجيل في جامعة عمان العربية:
📅 فتح باب القبول والتسجيل للفصل الدراسي 2026-2025
📞 للاستفسار والتسجيل: 0798877440
🌐 الموقع الإلكتروني: https://www.aau.edu.jo/ar
👥 متاح للطلاب الأردنيين وغير الأردنيين
📋 يمكن التواصل مع قسم القبول والتسجيل للحصول على معلومات تفصيلية عن الشروط والأوراق المطلوبة"""
    },
    "discounts": {
        "keywords": ["خصم", "منحة", "ثانوية", "معدل", "ضمان", "متقاعد", "discount", "scholarship"],
        "info": """الخصومات المتاحة في جامعة عمان العربية:
💰 خصومات حقيقية إضافية لكامل فترة الدراسة
🎓 خصم معدل الثانوية العامة: يصل إلى 90% حسب المعدل
👴 خصم متقاعدي الضمان الاجتماعي
💳 نوافذ الحلول المالية للطلاب
📞 للاستفسار: 0798877440"""
    },
    "fees": {
        "keywords": ["رسوم", "اقساط", "دفع", "تكلفة", "سعر", "ساعة", "fees", "tuition"],
        "info": """رسوم الدراسة في جامعة عمان العربية:
💵 جدول رسوم الساعات الدراسية مفصل متوفر على الموقع
💳 نوافذ الحلول المالية للطلاب
🎁 خصومات تصل إلى 90% حسب معدل الثانوية
📞 للاستفسار عن الرسوم: 0798877440
🌐 الموقع: https://www.aau.edu.jo/ar"""
    }
}

def search_aau_knowledge(query):
    """البحث في قاعدة المعرفة"""
    query_lower = query.lower()
    results = []
    
    for category, data in KNOWLEDGE_BASE.items():
        for keyword in data["keywords"]:
            if keyword in query_lower:
                results.append(data["info"])
                break
    
    if results:
        return "\n\n".join(results)
    
    return """لم أجد معلومات محددة عن سؤالك في قاعدة البيانات الحالية.
يمكنك التواصل مباشرة مع جامعة عمان العربية:
📞 الهاتف: 0798877440
🌐 الموقع: https://www.aau.edu.jo/ar"""

# تعريف الأداة لـ OpenAI Function Calling
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_aau_knowledge",
            "description": "البحث في قاعدة معرفة جامعة عمان العربية للحصول على معلومات عن التواصل، التصنيفات، الاعتمادات، التخصصات، القبول، الخصومات، والرسوم",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "سؤال المستخدم أو الكلمات المفتاحية للبحث"
                    }
                },
                "required": ["query"]
            }
        }
    }
]

# System message
SYSTEM_MESSAGE = """أنت Tec 🤖، مساعد ذكي متخصص في جامعة عمان العربية.

مهمتك:
1. فهم أسئلة المستخدمين بدقة
2. استخدام أداة البحث للحصول على معلومات دقيقة
3. تقديم إجابات واضحة ومفيدة باللغة العربية
4. إذا لم تجد المعلومة، وجه المستخدم للاتصال بالجامعة

أسلوبك:
- ودود ومحترف
- واضح ومباشر
- استخدم الإيموجي بشكل مناسب
- قدم معلومات منظمة وسهلة القراءة"""

# تخزين المحادثات
conversations = {}

def chat(user_id, message):
    """التفاعل مع المستخدم"""
    try:
        # إنشاء محادثة جديدة إذا لم تكن موجودة
        if user_id not in conversations:
            conversations[user_id] = [
                {"role": "system", "content": SYSTEM_MESSAGE}
            ]
        
        # إضافة رسالة المستخدم
        conversations[user_id].append({"role": "user", "content": message})
        
        # استدعاء OpenAI
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=conversations[user_id],
            tools=tools,
            tool_choice="auto"
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls
        
        # إذا طلب الوكيل استخدام أداة
        if tool_calls:
            conversations[user_id].append(response_message)
            
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                if function_name == "search_aau_knowledge":
                    function_response = search_aau_knowledge(function_args.get("query"))
                    
                    conversations[user_id].append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": function_response
                    })
            
            # استدعاء ثاني للحصول على الإجابة النهائية
            second_response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=conversations[user_id]
            )
            
            final_message = second_response.choices[0].message.content
            conversations[user_id].append({"role": "assistant", "content": final_message})
            return final_message
        
        else:
            # إجابة مباشرة بدون استخدام أدوات
            final_message = response_message.content
            conversations[user_id].append({"role": "assistant", "content": final_message})
            return final_message
    
    except Exception as e:
        return f"عذراً، حدث خطأ: {str(e)}\n\nيمكنك التواصل مع الجامعة على: 0798877440"

if __name__ == "__main__":
    print("Tec AI Agent - جاهز للعمل!")
    print("=" * 60)
    
    test_questions = [
        "مرحبا، كيف يمكنني التواصل مع الجامعة؟",
        "ما هي تصنيفات جامعة عمان العربية؟",
        "هل كلية الأعمال معتمدة؟",
        "كم الخصم على معدل 95؟"
    ]
    
    user_id = "test_user"
    
    for question in test_questions:
        print(f"\n💬 سؤال: {question}")
        answer = chat(user_id, question)
        print(f"🤖 Tec: {answer}")
        print("-" * 60)

