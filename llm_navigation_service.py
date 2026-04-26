import json
import os
import re
from pathlib import Path
from openai import AsyncOpenAI


ROOT_DIR = Path(__file__).resolve().parent
PROMPTS_DIR = ROOT_DIR / "prompts"


def load_prompt_template(filename: str) -> str:
    return (PROMPTS_DIR / filename).read_text(encoding="utf-8").strip()


class LLMNavigationService:
    def __init__(self, api_key: str = None, base_url: str = "https://api.minimax.io/v1"):
        self.client = AsyncOpenAI(
            api_key=api_key or os.getenv("MINIMAX_API_KEY"),
            base_url=base_url
        )
        self.model = os.getenv("MINIMAX_MODEL", "MiniMax-M2.7")
        self.navigation_system_prompt = load_prompt_template("navigation_system.txt")
        self.navigation_user_prompt = load_prompt_template("navigation_user.txt")

    async def enhance_instructions(self, instructions: list[str], current_location: str) -> list[str]:
        """Verilen talimatları daha anlaşılır Türkçe metne dönüştürüp liste olarak döndürür."""
        prompt = self._build_prompt(instructions, current_location)

        response = await self.client.chat.completions.create(
            model=self.model,
            temperature=0.1,
            messages=[
                {"role": "system", "content": self.navigation_system_prompt},
                {"role": "user", "content": prompt}
            ]
        )

        raw = self._strip_think_tags(response.choices[0].message.content)
        return self._parse_steps_json(raw)

    @staticmethod
    def _strip_think_tags(text: str) -> str:
        """MiniMax modelinin döndürdüğü <think>...</think> bloklarını temizler."""
        return re.sub(r"<think>.*?</think>\s*", "", text, flags=re.DOTALL).strip()

    @staticmethod
    def _parse_steps_json(text: str) -> list[str]:
        """Model çıktısından JSON steps listesini parse eder.

        Model bazen JSON'u markdown code block içinde dönebilir,
        veya düz JSON olarak. Her iki durumu da handle eder.
        """
        # Markdown code block varsa içindekileri al
        code_block = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
        json_str = code_block.group(1).strip() if code_block else text.strip()

        data = json.loads(json_str)
        if not isinstance(data, dict):
            raise ValueError("LLM response must be a JSON object.")

        steps = data.get("steps")
        if not isinstance(steps, list) or not all(isinstance(step, str) for step in steps):
            raise ValueError("LLM response 'steps' must be a list of strings.")

        return steps

    def _build_prompt(self, instructions: list[str], current_location: str) -> str:
        steps_text = "\n".join(f"{i+1}. {instr}" for i, instr in enumerate(instructions))
        return self.navigation_user_prompt.format(
            current_location=current_location,
            steps_text=steps_text,
        )

    