import os
import re
from openai import AsyncOpenAI


class LLMNavigationService:
    def __init__(self, api_key: str = None, base_url: str = "https://api.minimax.io/v1"):
        self.client = AsyncOpenAI(
            api_key=api_key or os.getenv("MINIMAX_API_KEY"),
            base_url=base_url
        )
        self.model = os.getenv("MINIMAX_MODEL", "MiniMax-M2.5")

    async def enhance_instructions(self, instructions: list[str], current_location: str) -> str:
        """Verilen talimatları daha anlaşılır Türkçe metne dönüştürür."""
        prompt = self._build_prompt(instructions, current_location)

        response = await self.client.chat.completions.create(
            model=self.model,
            temperature=0.1,
            messages=[
                {"role": "system", "content": "Sen bir navigasyon asistanısın. Kullanıcıya verilecek talimatları net, anlaşılır ve adım adım Türkçe olarak sözlü yönlendirmeye dönüştür. Her zaman Türkçe konuş."},
                {"role": "user", "content": prompt}
            ]
        )

        return self._strip_think_tags(response.choices[0].message.content)

    @staticmethod
    def _strip_think_tags(text: str) -> str:
        """MiniMax modelinin döndürdüğü <think>...</think> bloklarını temizler."""
        return re.sub(r"<think>.*?</think>\s*", "", text, flags=re.DOTALL).strip()

    def _build_prompt(self, instructions: list[str], current_location: str) -> str:
        steps_text = "\n".join(f"{i+1}. {instr}" for i, instr in enumerate(instructions))
        return f"""Mevcut konum: {current_location}

Ham adımlar:
{steps_text}

Bu talimatları Türkçe olarak, navigasyon uygulamasında okunacak şekilde düzgün bir metne dönüştür. Kısa ve net olmalı. Sadece talimatları ver, başka bir şey ekleme."""

    async def generate_route_description(self, path: list[str], instructions: list[str]) -> str:
        """Rota için kısa bir özet ve genel yönergesi üretir."""
        prompt = f"""Rota özeti:
Başlangıç: {path[0]}
Varış: {path[-1]}
Adımlar: {len(path)}

Talimatlar:
{chr(10).join(f"{i+1}. {instr}" for i, instr in enumerate(instructions))}

Bu rotayı kısaca özetle (2-3 cümle). Türkçe konuş."""

        response = await self.client.chat.completions.create(
            model=self.model,
            temperature=0.1,
            messages=[
                {"role": "system", "content": "Sen bir navigasyon asistanısın. Rota özetlerini kısa ve net Türkçe cümlelerle yaz."},
                {"role": "user", "content": prompt}
            ]
        )

        return self._strip_think_tags(response.choices[0].message.content)
