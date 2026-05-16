# -*- coding: utf-8 -*-
"""Contract checks for the alert-center P0 documentation."""

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DOC_PATH = PROJECT_ROOT / "docs" / "alerts.md"


def _read_doc() -> str:
    return DOC_PATH.read_text(encoding="utf-8")


def test_alerts_doc_exists_and_links_p0_scope() -> None:
    doc = _read_doc()

    assert "Issue #1202 P0" in doc
    assert "AGENT_EVENT_ALERT_RULES_JSON" in doc
    assert "EventMonitor" in doc
    assert "P0 不做" in doc


def test_alerts_doc_covers_legacy_runtime_rules() -> None:
    doc = _read_doc()

    for token in ("price_cross", "price_change_percent", "volume_spike"):
        assert token in doc
    for token in ("sentiment_shift", "risk_flag", "custom"):
        assert token in doc


def test_alerts_doc_defines_required_contract_entities() -> None:
    doc = _read_doc()

    required_sections = (
        "### `alert_rule`",
        "### `alert_trigger`",
        "### `alert_notification`",
        "### `alert_cooldown`",
    )
    for section in required_sections:
        assert section in doc

    required_fields = (
        "target_scope",
        "parameters",
        "cooldown_policy",
        "notification_policy",
        "observed_value",
        "data_timestamp",
        "trigger_id",
        "latency_ms",
        "cooldown_until",
    )
    for field_name in required_fields:
        assert field_name in doc


def test_alerts_doc_covers_storage_evaluation_and_rollback() -> None:
    doc = _read_doc()

    assert (PROJECT_ROOT / "src" / "storage.py").is_file()

    for token in (
        "## 存储方案评估",
        "src/storage.py",
        "src/repositories/",
        "src/services/",
        "data/stock_analysis.db",
        "幂等初始化",
        "回滚说明",
    ):
        assert token in doc


def test_alerts_doc_keeps_p0_non_goals_explicit() -> None:
    doc = _read_doc()

    for token in (
        "不新增 `src/schemas/alerts.py`",
        "不新增 Web 告警中心页面",
        "不新增数据库表",
        "不实现触发历史",
        "不自动迁移、删除或覆盖 `AGENT_EVENT_ALERT_RULES_JSON`",
        "不重写 `NotificationService`",
    ):
        assert token in doc
