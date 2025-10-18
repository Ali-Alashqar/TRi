"""
AI Agent للبحث في موقع جامعة عمان العربية
يستخدم LangChain و OpenAI لتقديم إجابات ذكية
"""

import os
import requests
from bs4 import BeautifulSoup
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import SystemMessage
from langchain_core.tools import tool

# إعداد OpenAI API (متوفر في البيئة)
llm = ChatOpenAI(
    model="gpt-4.1-mini",
    temperature=0.7,
    api_key=os.getenv("OPENAI_API_KEY")
)

@tool
def search_aau_website(query: str) -> str:
    """
    أداة للبحث في موقع جامعة عمان العربية.
    استخدم هذه الأداة عندما يسأل المستخدم عن معلومات الجامعة.
    
    Args:
        query: سؤال المستخدم أو الكلمات المفتاحية للبحث
    
    Returns:
        معلومات من موقع جامعة عمان العربية
    """
    try:
        # قاعدة معرفة محلية شاملة عن الجامعة
        knowledge_base = {
            "contact": {
                "keywords": ["رقم", "هاتف", "تواصل", "اتصال", "موبايل", "جوال", "ايميل", "بريد"],
                "info": """
معلومات التواصل مع جامعة عمان العربية:
- الهاتف: 0798877440
- الموقع الإلكتروني: https://www.aau.edu.jo/ar
- العنوان: شارع الأردن، مبيس - عمان، الأردن
- أوقات العمل: من الأحد إلى الخميس
- وسائل التواصل الاجتماعي: Facebook, LinkedIn, Twitter, YouTube
"""
            },
            "rankings": {
                "keywords": ["تصنيف", "ترتيب", "مرتبة", "إنجازات", "تميز"],
                "info": """
إنجازات وتصنيفات جامعة عمان العربية:
- دخول تصنيف QS العالمي 2026 للمرة الأولى
- المرتبة 110 عربياً في تصنيف QS Arab Region 2025
- المرتبة السادسة في تصنيف التايمز للجامعات العربية
- المرتبة الرابعة أردنياً في تصنيف التايمز للتأثير 2025
- المرتبة الأولى على الجامعات الخاصة في تصنيف ويبوميتركس 2025
- المرتبة الأولى على الجامعات الخاصة والثانية أردنياً في تصنيف سيماجو 2025
- المرتبة السادسة محلياً وضمن أول 388 جامعة عالمياً في تصنيف Green Metric 2024
"""
            },
            "accreditations": {
                "keywords": ["اعتماد", "شهادة", "جودة", "معتمد"],
                "info": """
الاعتمادات الدولية لجامعة عمان العربية:
- EUR-ACE: اعتماد دولي لهندسة البرمجيات (4 سنوات)
- AABI: الأولى عربياً والسادس عالمياً في اعتماد الطيران الدولي
- AACSB: اعتماد أمريكي لكلية الأعمال (مجدد)
- ACPE: اعتماد أمريكي لكلية الصيدلة
- IAA: موافقة أولية لاعتماد كلية الشريعة
- EASA: اعتماد وكالة سلامة الطيران الأوروبية
- ISO: شهادة الأيزو (2020-2027)
"""
            },
            "majors": {
                "keywords": ["تخصص", "كلية", "برنامج", "دراسة", "بكالوريوس", "ماجستير"],
                "info": """
الكليات والتخصصات في جامعة عمان العربية:
- كلية الهندسة: هندسة البرمجيات (معتمدة EUR-ACE)، هندسة الطيران (معتمدة AABI و EASA)
- كلية الأعمال: معتمدة أمريكياً AACSB، تخصصات: إدارة، محاسبة، تسويق، مالية
- كلية الصيدلة: معتمدة أمريكياً ACPE
- كلية الشريعة: اعتماد دولي IAA
- كلية الحقوق
- كلية العلوم التربوية والنفسية
- كلية تكنولوجيا المعلومات
- كلية الآداب والعلوم
- كلية علوم الطيران
- كلية العلوم الطبية التطبيقية
- الكلية التقنية
"""
            },
            "admission": {
                "keywords": ["قبول", "تسجيل", "التحاق", "طالب", "شروط"],
                "info": """
القبول والتسجيل في جامعة عمان العربية:
- فتح باب القبول والتسجيل للفصل الدراسي 2026-2025
- للاستفسار والتسجيل: 0798877440
- الموقع الإلكتروني: https://www.aau.edu.jo/ar
- يمكن التواصل مع قسم القبول والتسجيل للحصول على معلومات تفصيلية
- متاح للطلاب الأردنيين وغير الأردنيين
"""
            },
            "discounts": {
                "keywords": ["خصم", "منحة", "ثانوية", "معدل", "ضمان", "متقاعد"],
                "info": """
الخصومات المتاحة في جامعة عمان العربية:
- خصومات حقيقية إضافية لكامل فترة الدراسة
- خصم معدل الثانوية العامة: يصل إلى 90% حسب المعدل
- خصم متقاعدي الضمان الاجتماعي
- نوافذ الحلول المالية للطلاب
للاستفسار: 0798877440
"""
            },
            "fees": {
                "keywords": ["رسوم", "اقساط", "دفع", "تكلفة", "سعر", "ساعة"],
                "info": """
رسوم الدراسة في جامعة عمان العربية:
- جدول رسوم الساعات الدراسية مفصل متوفر على الموقع
- نوافذ الحلول المالية للطلاب
- خصومات تصل إلى 90% حسب معدل الثانوية
- للاستفسار عن الرسوم: 0798877440
- الموقع: https://www.aau.edu.jo/ar
"""
            }
        }
        
        # البحث في قاعدة المعرفة
        query_lower = query.lower()
        results = []
        
        for category, data in knowledge_base.items():
            for keyword in data["keywords"]:
                if keyword in query_lower:
                    results.append(data["info"])
                    break
        
        if results:
            return "\n\n".join(results)
        
        # إذا لم نجد نتائج، نعيد معلومات عامة
        return """
لم أجد معلومات محددة عن سؤالك في قاعدة البيانات الحالية.
يمكنك التواصل مباشرة مع جامعة عمان العربية:
- الهاتف: 0798877440
- الموقع: https://www.aau.edu.jo/ar
"""
    
    except Exception as e:
        return f"عذراً، حدث خطأ أثناء البحث: {str(e)}"

# الأداة جاهزة (تم تعريفها باستخدام @tool decorator)

# إعداد prompt للوكيل
system_message = """أنت Tec، مساعد ذكي متخصص في جامعة عمان العربية.

مهمتك:
1. فهم أسئلة المستخدمين بدقة
2. استخدام أداة البحث للحصول على معلومات دقيقة
3. تقديم إجابات واضحة ومفيدة باللغة العربية
4. إذا لم تجد المعلومة، وجه المستخدم للاتصال بالجامعة

أسلوبك:
- ودود ومحترف
- واضح ومباشر
- استخدم الإيموجي بشكل مناسب
- قدم معلومات منظمة وسهلة القراءة
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_message),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# إنشاء الوكيل
tools = [search_aau_website]
agent = create_openai_functions_agent(llm, tools, prompt)

# إنشاء الذاكرة
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

# إنشاء Agent Executor
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True,
    handle_parsing_errors=True
)

def chat(message: str) -> str:
    """
    دالة للتفاعل مع الوكيل
    """
    try:
        response = agent_executor.invoke({"input": message})
        return response["output"]
    except Exception as e:
        return f"عذراً، حدث خطأ: {str(e)}\n\nيمكنك التواصل مع الجامعة على: 0798877440"

if __name__ == "__main__":
    # اختبار الوكيل
    print("Tec AI Agent - جاهز للعمل!")
    print("=" * 50)
    
    test_questions = [
        "مرحبا، كيف يمكنني التواصل مع الجامعة؟",
        "ما هي تصنيفات جامعة عمان العربية؟",
        "هل كلية الأعمال معتمدة؟"
    ]
    
    for question in test_questions:
        print(f"\nسؤال: {question}")
        answer = chat(question)
        print(f"جواب: {answer}")
        print("-" * 50)

