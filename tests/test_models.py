"""Unit tests for the data model and its (de)serialisation."""

from __future__ import annotations

from ha_adapt.const import DEFAULT_SCHEMA_ID, MODE_SENSOR
from ha_adapt.models import GlobalSettings, Schema, StoreData


def test_storedata_always_has_default_schema():
    data = StoreData()
    assert DEFAULT_SCHEMA_ID in data.schemas
    assert data.schemas[DEFAULT_SCHEMA_ID].name == "Default"


def test_schema_round_trip():
    schema = Schema(id="x", name="X", mode=MODE_SENSOR, sensor_max=500)
    restored = Schema.from_dict(schema.to_dict())
    assert restored == schema


def test_from_dict_ignores_unknown_keys():
    schema = Schema.from_dict(
        {"id": "x", "name": "X", "bogus_field": 123, "mode": "sun"}
    )
    assert schema.id == "x"
    assert not hasattr(schema, "bogus_field")


def test_schema_for_falls_back_to_default():
    data = StoreData(
        schemas={
            DEFAULT_SCHEMA_ID: Schema(id=DEFAULT_SCHEMA_ID, name="Default"),
            "warm": Schema(id="warm", name="Warm"),
        },
        assignments={"light.kitchen": "warm"},
    )
    assert data.schema_for("light.kitchen").id == "warm"
    assert data.schema_for("light.unknown").id == DEFAULT_SCHEMA_ID
    # An assignment pointing at a deleted schema also falls back safely.
    data.assignments["light.kitchen"] = "missing"
    assert data.schema_for("light.kitchen").id == DEFAULT_SCHEMA_ID


def test_storedata_round_trip():
    data = StoreData(
        settings=GlobalSettings(interval=60, transition=10),
        schemas={DEFAULT_SCHEMA_ID: Schema(id=DEFAULT_SCHEMA_ID, name="Default")},
        assignments={"light.a": DEFAULT_SCHEMA_ID},
    )
    restored = StoreData.from_dict(data.to_dict())
    assert restored.settings.interval == 60
    assert restored.settings.transition == 10
    assert restored.assignments == {"light.a": DEFAULT_SCHEMA_ID}
