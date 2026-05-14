import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use Gemini Flash (as requested by user setting, gemini-flash-latest is a reliable alias)
model = genai.GenerativeModel('gemini-flash-latest')

app = FastAPI(title="SMS Spam Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SMSInput(BaseModel):
    text: str

class SMSClassification(BaseModel):
    category: str
    confidence: str
    reason: str
    suspicious_elements: List[str]
    action: str

SYSTEM_PROMPT = """You are an AI system specialized in detecting SMS spam and fraud messages.

Your task is to analyze the given SMS text and classify it into one of the following categories:
1. Spam
2. Fraud/Scam
3. Promotional
4. Safe/Legitimate

Also provide:
- A confidence score (0 to 100%)
- Key reasons for classification
- Highlight suspicious words/phrases
- Suggest if the message should be blocked or allowed

Detection guidelines:
- Fraud/Scam: Requests for OTP, bank details, urgent money transfer, fake job offers, lottery winnings, impersonation (bank/government)
- Spam: Repetitive, irrelevant, bulk marketing, unknown links
- Promotional: Legit marketing (sales, offers, discounts from known brands)
- Safe: Personal or trusted communication

Be strict in detecting fraud and prioritize user safety.

Input SMS:
"{sms_text}"

Output format (JSON):
{
  "category": "",
  "confidence": "",
  "reason": "",
  "suspicious_elements": [],
  "action": ""
}

Return ONLY the JSON object."""

@app.post("/classify", response_model=SMSClassification)
async def classify_sms(sms_input: SMSInput):
    try:
        prompt = SYSTEM_PROMPT.replace("{sms_text}", sms_input.text)
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        
        # Parse the response text as JSON
        result = json.loads(response.text)
        return result
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
