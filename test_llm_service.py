import os
import pytest

# .env dosyasını yükle
from dotenv import load_dotenv
load_dotenv()

from llm_navigation_service import LLMNavigationService


# ── Birim testleri (API çağrısı yapmaz) ─────────────────────────────────────

class TestStripThinkTags:
    """_strip_think_tags yardımcı fonksiyonunun testleri."""

    def test_think_blogu_temizlenir(self):
        text = "<think>reasoning here</think>\nAsıl cevap burada."
        assert LLMNavigationService._strip_think_tags(text) == "Asıl cevap burada."

    def test_think_blogu_yoksa_degismez(self):
        text = "Düz metin, think bloğu yok."
        assert LLMNavigationService._strip_think_tags(text) == text

    def test_coklu_think_blogu(self):
        text = "<think>a</think>Bir. <think>b</think>İki."
        result = LLMNavigationService._strip_think_tags(text)
        assert "<think>" not in result
        assert "Bir." in result
        assert "İki." in result

    def test_cok_satirli_think_blogu(self):
        text = "<think>\nuzun\ndüşünce\n</think>\nSonuç."
        assert LLMNavigationService._strip_think_tags(text) == "Sonuç."


class TestParseStepsJson:
    """_parse_steps_json yardımcı fonksiyonunun testleri."""

    def test_duz_json(self):
        text = '{"steps": ["Düz ilerleyin.", "Sağa dönün."]}'
        result = LLMNavigationService._parse_steps_json(text)
        assert result == ["Düz ilerleyin.", "Sağa dönün."]

    def test_markdown_code_block(self):
        text = '```json\n{"steps": ["Adım 1", "Adım 2"]}\n```'
        result = LLMNavigationService._parse_steps_json(text)
        assert result == ["Adım 1", "Adım 2"]

    def test_markdown_code_block_dilsiz(self):
        text = '```\n{"steps": ["Adım 1"]}\n```'
        result = LLMNavigationService._parse_steps_json(text)
        assert result == ["Adım 1"]

    def test_tek_adim(self):
        text = '{"steps": ["Koridordan devam edin."]}'
        result = LLMNavigationService._parse_steps_json(text)
        assert result == ["Koridordan devam edin."]

    def test_gecersiz_json_hata_verir(self):
        with pytest.raises((ValueError, KeyError)):
            LLMNavigationService._parse_steps_json("bu json değil")

    def test_steps_string_ise_hata_verir(self):
        text = '{"steps": "Düz ilerleyin."}'
        with pytest.raises(ValueError):
            LLMNavigationService._parse_steps_json(text)

    def test_steps_yoksa_hata_verir(self):
        text = '{"message": "Düz ilerleyin."}'
        with pytest.raises(ValueError):
            LLMNavigationService._parse_steps_json(text)

    def test_steps_string_listesi_degilse_hata_verir(self):
        text = '{"steps": ["Düz ilerleyin.", 42]}'
        with pytest.raises(ValueError):
            LLMNavigationService._parse_steps_json(text)


class TestPromptTemplates:
    """Prompt şablonlarının formatlanabilir olduğunu doğrular."""

    def test_service_default_model_m27(self, monkeypatch):
        monkeypatch.delenv("MINIMAX_MODEL", raising=False)
        service = LLMNavigationService(api_key="test-key")

        assert service.model == "MiniMax-M2.7"

    def test_navigation_prompt_formatlanir(self):
        service = LLMNavigationService(api_key="test-key")
        prompt = service._build_prompt(
            ["Düz ilerleyin.", "Asansör ile 1. kata çıkın."],
            "ZEMIN_KAT_1",
        )

        assert "ZEMIN_KAT_1" in prompt
        assert '{"steps": ["..."]}' in prompt
        assert "MiniMax" not in prompt
        assert "M2.7" not in prompt


# ── Entegrasyon testleri (gerçek API çağrısı) ───────────────────────────────

API_KEY = os.getenv("MINIMAX_API_KEY")
skip_no_key = pytest.mark.skipif(not API_KEY, reason="MINIMAX_API_KEY not set")


@skip_no_key
class TestLLMServiceIntegration:
    """Gerçek MiniMax API'sine bağlanarak çalışır."""

    @pytest.fixture
    def service(self):
        return LLMNavigationService()

    @pytest.mark.asyncio
    async def test_enhance_instructions_list_doner(self, service):
        """enhance_instructions list[str] döndürmeli."""
        result = await service.enhance_instructions(
            ["Düz ilerleyin.", "Sağa yönelin.", "Koridordan devam edin."],
            "Ana Giriş"
        )
        assert isinstance(result, list)
        assert len(result) > 0
        assert all(isinstance(s, str) for s in result)

    @pytest.mark.asyncio
    async def test_enhance_instructions_tekrar_birlestirme(self, service):
        """Ardışık tekrarlı adımlar birleştirilmeli, adım sayısı azalmalı."""
        ham_adimlar = [
            "Düz ilerleyin.",
            "Düz ilerleyin.",
            "Düz ilerleyin.",
            "Sağa yönelin.",
            "Koridordan devam edin.",
            "Koridordan devam edin.",
        ]
        result = await service.enhance_instructions(ham_adimlar, "Zemin Kat Girişi")
        assert isinstance(result, list)
        assert len(result) < len(ham_adimlar)

    @pytest.mark.asyncio
    async def test_enhance_instructions_turkce(self, service):
        """Yanıttaki adımlar Türkçe karakterler içermeli."""
        result = await service.enhance_instructions(
            ["Giriş kapısından geçin.", "Koridordan devam edin.", "Radyoloji kapısından girin."],
            "Giriş"
        )
        turkce_harfler = set("çğıöşüÇĞİÖŞÜ")
        tum_metin = " ".join(result)
        assert any(c in turkce_harfler for c in tum_metin), \
            f"Yanıtta Türkçe karakter bulunamadı: {result}"

    @pytest.mark.asyncio
    async def test_generate_route_description(self, service):
        """generate_route_description string özet döndürmeli."""
        result = await service.generate_route_description(
            ["ZEMIN_KAT_1", "ZEMIN_KAT_5", "KAT_1_3", "KAT_1_6"],
            ["Girişten koridora yürü", "Asansöre bin", "1. katta sağa dön"]
        )
        assert isinstance(result, str)
        assert len(result) > 10
