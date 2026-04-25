import pytest
from navigator import find_route

GRAPH = "graph.json"


# ── Aynı kat testleri ─────────────────────────────────────────────────────────

def test_zemin_ayni_kat_kardiyoloji():
    """Zemin katta kardiyoloji koridoru içi navigasyon"""
    result = find_route(GRAPH, "ZEMIN_KAT_30", "ZEMIN_KAT_34", avoid_stairs=True)
    assert result is not None
    assert result["path"][0] == "ZEMIN_KAT_30"
    assert result["path"][-1] == "ZEMIN_KAT_34"
    assert len(result["instructions"]) > 0

def test_zemin_ayni_kat_ortopedi():
    """Zemin katta ortopedi koridoru içi navigasyon"""
    result = find_route(GRAPH, "ZEMIN_KAT_17", "ZEMIN_KAT_24", avoid_stairs=True)
    assert result is not None
    assert result["path"][0] == "ZEMIN_KAT_17"
    assert result["path"][-1] == "ZEMIN_KAT_24"

def test_kat1_ayni_kat_radyoloji():
    """1. katta radyoloji koridoru içi navigasyon"""
    result = find_route(GRAPH, "KAT_1_14", "KAT_1_27", avoid_stairs=True)
    assert result is not None
    assert result["path"][0] == "KAT_1_14"
    assert result["path"][-1] == "KAT_1_27"

def test_kat1_ayni_kat_beyin_cerrahi():
    """1. katta beyin cerrahi koridoru içi navigasyon"""
    result = find_route(GRAPH, "KAT_1_29", "KAT_1_22", avoid_stairs=True)
    assert result is not None
    assert result["path"][0] == "KAT_1_29"
    assert result["path"][-1] == "KAT_1_22"


# ── Katlar arası testler ──────────────────────────────────────────────────────

def test_zemin_to_kat1_asansor():
    """Zemin girişten 1. kat kardiyolojiye — merdivenden kaçın (asansör tercih)"""
    result = find_route(GRAPH, "ZEMIN_KAT_1", "KAT_1_6", avoid_stairs=True)
    assert result is not None
    assert result["path"][0] == "ZEMIN_KAT_1"
    assert result["path"][-1] == "KAT_1_6"

def test_zemin_to_kat1_merdivenli():
    """Zemin girişten 1. kat kardiyolojiye — merdiven serbest"""
    result = find_route(GRAPH, "ZEMIN_KAT_1", "KAT_1_6", avoid_stairs=False)
    assert result is not None
    assert result["path"][0] == "ZEMIN_KAT_1"
    assert result["path"][-1] == "KAT_1_6"

def test_zemin_to_kat1_radyoloji():
    """Zemin girişten 1. kat radyolojiye"""
    result = find_route(GRAPH, "ZEMIN_KAT_1", "KAT_1_15", avoid_stairs=True)
    assert result is not None
    assert result["path"][-1] == "KAT_1_15"

def test_zemin_to_kat1_dogumhane():
    """Zemin kadın doğum girişinden 1. kat doğumhaneye"""
    result = find_route(GRAPH, "ZEMIN_KAT_75", "KAT_1_58", avoid_stairs=True)
    assert result is not None
    assert result["path"][-1] == "KAT_1_58"


# ── Geçersiz düğüm testleri ──────────────────────────────────────────────────

def test_gecersiz_baslangic():
    """Var olmayan başlangıç düğümü None döndürmeli"""
    result = find_route(GRAPH, "YANLIS_NODE", "KAT_1_6", avoid_stairs=True)
    assert result is None

def test_gecersiz_hedef():
    """Var olmayan hedef düğümü None döndürmeli"""
    result = find_route(GRAPH, "ZEMIN_KAT_1", "YANLIS_NODE", avoid_stairs=True)
    assert result is None

def test_her_ikisi_gecersiz():
    """İkisi de geçersiz düğüm — None döndürmeli"""
    result = find_route(GRAPH, "YOK_1", "YOK_2", avoid_stairs=True)
    assert result is None


# ── Start == Goal ─────────────────────────────────────────────────────────────

def test_baslangic_hedef_ayni():
    """Başlangıç ve hedef aynı düğüm — boş yol ve talimat döndürmeli"""
    result = find_route(GRAPH, "ZEMIN_KAT_1", "ZEMIN_KAT_1", avoid_stairs=True)
    assert result is not None
    assert result["path"] == ["ZEMIN_KAT_1"]
    assert result["instructions"] == []
