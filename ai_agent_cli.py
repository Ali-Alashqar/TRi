"""
AI Agent CLI - مع دعم سياق المحادثة وتحليل الصور
"""

import sys
import json
import os
import base64
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

KNOWLEDGE_BASE = {
    "admissions": {
        "keywords": ["قبول", "تسجيل", "شروط", "معدلات", "تخصصات", "بكالوريوس", "ماجستير", "دكتوراه", "تقديم"],
        "info": """للقبول والتسجيل في جامعة عمان العربية، يرجى زيارة الموقع الرسمي للجامعة أو التواصل مع دائرة القبول والتسجيل. تختلف شروط القبول والمعدلات المطلوبة حسب التخصص والدرجة العلمية (بكالوريوس، ماجستير، دكتوراه).
        يمكنك العثور على التفاصيل الكاملة وشروط التقديم على الرابط التالي: https://www.aau.edu.jo/ar/admission-and-registration
        أو الاتصال على 0798877440."""
    },
    "fees": {
        "keywords": ["رسوم", "قسط", "تكلفة", "دفع", "مالي", "أقساط"],
        "info": """تختلف الرسوم الدراسية في جامعة عمان العربية حسب التخصص والبرنامج. للحصول على معلومات دقيقة حول الرسوم الدراسية، يرجى زيارة صفحة الرسوم على الموقع الرسمي للجامعة أو التواصل مع الدائرة المالية.
        رابط الرسوم الدراسية: https://www.aau.edu.jo/ar/fees
        أو الاتصال على 0798877440."""
    },
    "faculties": {
        "keywords": ["كليات", "تخصصات", "أقسام", "دراسة", "برامج"],
        "info": """تضم جامعة عمان العربية العديد من الكليات والتخصصات المتميزة، منها:
        - كلية العلوم وتكنولوجيا المعلومات
        - كلية الهندسة
        - كلية الأعمال
        - كلية الحقوق
        - كلية الآداب والعلوم
        - كلية العمارة والتصميم
        - كلية علوم الطيران
        يمكنك استعراض جميع الكليات والتخصصات المتاحة على الموقع الرسمي للجامعة: https://www.aau.edu.jo/ar/faculties-and-departments"""
    },
    "library": {
        "keywords": ["مكتبة", "كتب", "مراجع", "بحث", "دراسات"],
        "info": """توفر مكتبة جامعة عمان العربية مصادر غنية للطلاب والباحثين، بما في ذلك الكتب والمجلات العلمية وقواعد البيانات الإلكترونية. يمكنك زيارة المكتبة خلال ساعات العمل أو الوصول إلى مصادرها الرقمية عبر موقع الجامعة.
        للمزيد من المعلومات حول خدمات المكتبة: https://www.aau.edu.jo/ar/library"""
    },
    "scholarships": {
        "keywords": ["منح", "خصومات", "مساعدات", "دعم مالي"],
        "info": """تقدم جامعة عمان العربية مجموعة متنوعة من المنح الدراسية والخصومات للطلاب المتفوقين وذوي الاحتياجات الخاصة. تتوفر تفاصيل المنح وشروط التقديم عليها على الموقع الرسمي للجامعة.
        صفحة المنح الدراسية: https://www.aau.edu.jo/ar/scholarships"""
    },
    "student_affairs": {
        "keywords": ["شؤون طلاب", "خدمات طلابية", "أنشطة", "سكن", "مواصلات"],
        "info": """تقدم دائرة شؤون الطلبة في جامعة عمان العربية مجموعة واسعة من الخدمات والأنشطة للطلاب، بما في ذلك الإرشاد الأكاديمي، الأنشطة اللامنهجية، خدمات السكن والمواصلات، والمساعدة في حل المشكلات الطلابية.
        للتواصل مع شؤون الطلبة: https://www.aau.edu.jo/ar/student-affairs"""
    },
    "location": {
        "keywords": ["موقع", "عنوان", "خريطة", "وصول", "كيف أصل"],
        "info": """تقع جامعة عمان العربية في شارع الأردن، منطقة مبـيس، عمان، الأردن. يمكنك استخدام خرائط Google للوصول إلى الجامعة بسهولة.
        رابط خرائط Google: https://maps.app.goo.gl/your-university-location"""
    },
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
    """البحث في قاعدة المعرفة باستخدام طريقة بسيطة وفعالة"""
    query_lower = query.lower()
    
    # البحث عن كلمات مفتاحية مطابقة
    best_match = None
    best_match_count = 0
    
    for category, data in KNOWLEDGE_BASE.items():
        keywords = data.get("keywords", [])
        match_count = sum(1 for keyword in keywords if keyword in query_lower)
        
        if match_count > best_match_count:
            best_match_count = match_count
            best_match = data.get("info", "")
    
    # إذا وجدنا تطابقاً، أعد المعلومات
    if best_match_count > 0:
        return best_match
    
    # إذا لم نجد تطابقاً، أعد رسالة افتراضية
    return f"لم أجد معلومات محددة عن '{query}'. يرجى الاتصال بالجامعة على الرقم 0798877440 للمساعدة."

SYSTEM_MESSAGE = """أنت Tec 🤖، مساعد ذكي في جامعة عمان العربية.
- اجب على الأسئلة بناءً على السياق السابق للمحادثة
- إذا تم إرسال صورة، قم بتحليلها وأجب على السؤال بناءً على محتوى الصورة
- استخدم المعلومات من قاعدة المعرفة
- كن ودياً واحترافياً
- استخدم الإيموجي بشكل مناسب
- حاول الإجابة على الأسئلة بشكل مباشر قدر الإمكان"""

def analyze_image(image_data):
    """تحليل الصورة باستخدام OpenAI Vision API"""
    try:
        # إذا كانت الصورة بصيغة base64
        if image_data.startswith('data:image'):
            # استخراج البيانات من data URL
            image_data = image_data.split(',')[1]
        
        return {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{image_data}"
            }
        }
    except Exception as e:
        return None

def chat(message, conversation_history=None, image_data=None):
    try:
        messages = [{"role": "system", "content": SYSTEM_MESSAGE}]
        
        if conversation_history:
            for hist_msg in conversation_history:
                messages.append({
                    "role": hist_msg.get("role", "user"),
                    "content": hist_msg.get("content", "")
                })
        
        # إنشء محتوى الرسالة
        user_content = [{"type": "text", "text": message}]
        
        # إضافة الصورة إذا كانت موجودة
        if image_data:
            image_content = analyze_image(image_data)
            if image_content:
                user_content.append(image_content)
        
        messages.append({
            "role": "user",
            "content": user_content if len(user_content) > 1 else message
        })
        
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
    try:
        input_data_raw = sys.stdin.read()
        input_data = json.loads(input_data_raw)
        message = input_data.get("message")
        conversation_history = input_data.get("conversationHistory")
        image_data = input_data.get("imageUrl")

        if not message:
            print(json.dumps({"error": "No message provided"}))
            sys.exit(1)
        
        response = chat(message, conversation_history, image_data)
        print(json.dumps({"response": response}, ensure_ascii=False))
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"An unexpected error occurred: {str(e)}"}))
        sys.exit(1)

