import os
import asyncio
import pytest
import pytest_asyncio

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
    async def test_enhance_instructions_basit(self, service):
        """Basit bir talimat listesiyle API yanıt dönmeli."""
        result = await service.enhance_instructions(
            ["A101 -> Koridor -> Merdiven"],
            "A101"
        )
        assert result is not None
        assert len(result) > 0
        assert "<think>" not in result

    @pytest.mark.asyncio
    async def test_enhance_instructions_cok_adimli(self, service):
        """Birden fazla adımlı talimatlar düzgün işlenmeli."""
        result = await service.enhance_instructions(
            [
                "Girişten koridora yürü",
                "Koridorda sola dön",
                "Asansöre bin, 1. kata çık",
                "Asansörden çıkınca sağa dön",
            ],
            "Ana Giriş"
        )
        assert result is not None
        assert len(result) > 10
        assert "<think>" not in result

    @pytest.mark.asyncio
    async def test_yanit_turkce(self, service):
        """Yanıt Türkçe karakterler içermeli."""
        result = await service.enhance_instructions(
            ["Giriş -> Koridor -> Radyoloji"],
            "Giriş"
        )
        turkce_harfler = set("çğıöşüÇĞİÖŞÜ")
        assert any(c in turkce_harfler for c in result), \
            f"Yanıtta Türkçe karakter bulunamadı: {result}"
